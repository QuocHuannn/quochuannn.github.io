import EventEmitter from "./Utils/EventEmitter.js";
import Experience from "./Experience.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import {
  Mesh,
  CubeTextureLoader,
  PlaneGeometry,
  ShaderMaterial,
  Color,
  AudioLoader,
} from "three";
import vertexShader from "./shaders/overlayLoading/vertex.glsl";
import fragmentShader from "./shaders/overlayLoading/fragment.glsl";
import { gsap } from "gsap";

export default class Resources extends EventEmitter {
  constructor(_assets = []) {
    super();
    this.banner = document.querySelector(".banner");
    this.loadingScreen = document.querySelector(".loadingScreen");
    this.audioButton = document.querySelector(".audio-button");
    this.loadingScreen.classList.add("show-loading-screen");

    this.experience = new Experience();
    this.renderer = this.experience.renderer.instance;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;
    this.resourcesLoaded = false;
    this.loader = this;
    this.setOverlayLoading();
    this.setLoaders();

    this.toLoad = 0;
    this.loaded = 0;
    this.items = {};

    this.groups = {};
    this.groups.assets = [..._assets];
    this.groups.loaded = [];
    this.groups.current = null;
    this.loadNextGroup();
  }

  setLoaders() {
    this.loaders = [];

    // Images
    this.loaders.push({
      extensions: ["jpg", "png"],
      action: (_resource) => {
        const image = new Image();
        image.addEventListener("load", () => {
          this.fileLoadEnd(_resource, image);
        });
        image.addEventListener("error", () => {
          this.fileLoadEnd(_resource, image);
        });
        image.src = _resource.source;
      },
    });

    // CubeTexture
    this.loaders.push({
      extensions: ["cubeTexture"],
      action: (_resource) => {
        const cubeTextureLoader = new CubeTextureLoader();
        cubeTextureLoader.load(_resource.source, (_data) => {
          this.fileLoadEnd(_resource, _data);
        });
      },
    });

    // KTX2/Basis images
    const basisLoader = new KTX2Loader();
    basisLoader.setTranscoderPath("basis/");
    basisLoader.detectSupport(this.renderer);

    this.loaders.push({
      extensions: ["ktx2"],
      action: (_resource) => {
        basisLoader.load(_resource.source, (_data) => {
          this.fileLoadEnd(_resource, _data);
        });
      },
    });

    // Draco
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("draco/");
    dracoLoader.setDecoderConfig({ type: "js" });

    // GLTF
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    this.loaders.push({
      extensions: ["glb", "gltf"],
      action: (_resource) => {
        gltfLoader.load(_resource.source, (_data) => {
          this.fileLoadEnd(_resource, _data);
        });
      },
    });

    // Audio
    const audioLoader = new AudioLoader();

    this.loaders.push({
      extensions: ["mp3", "ogg"],
      action: (_resource) => {
        audioLoader.load(_resource.source, (buffer) => {
          this.fileLoadEnd(_resource, buffer);
        });
      },
    });
  }

  setOverlayLoading() {
    this.overlayGeometry = new PlaneGeometry(2, 2, 1, 1);
    this.overlayMaterial = new ShaderMaterial({
      transparent: true,
      depthTest: false,
      uniforms: {
        uColor: { value: new Color(0x072446) },
        uAlpha: { value: 1 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    this.overlay = new Mesh(this.overlayGeometry, this.overlayMaterial);
    this.scene.add(this.overlay);
  }

  removeOverlay = () => {
    gsap.to(this.overlayMaterial.uniforms.uAlpha, {
      duration: 0.5,
      value: 0,
      delay: 1,
      ease: "sine.in",
      onComplete: () => {
        this.overlayGeometry.dispose();
        this.overlayMaterial.dispose();
        this.scene.remove(this.overlay);
        this.resourcesLoaded = true;
      },
      onStart: () => {
        this.banner.style.top = "0px";
        this.experience.navigation.orbitControls.enabled = true;
      },
    });
  };

  loadNextGroup() {
    this.groups.current = this.groups.assets.shift();

    if (!this.groups.current) return;

    this.groups.current.toLoad = 0;
    this.groups.current.loaded = 0;

    this.load(this.groups.current.items);
  }

  load(_resources = []) {
    for (const _resource of _resources) {
      this.toLoad++;
      if (this.groups.current) this.groups.current.toLoad++;

      const loader = this.loaders.find((_loader) => {
        if (_resource.type === "cubeTexture") {
          return _loader.extensions.includes("cubeTexture");
        } else {
          const extensionMatch = _resource.source
            ? _resource.source.match(/\.([a-zA-Z0-9]+)$/)
            : null;
          const extension = extensionMatch ? extensionMatch[1] : null;
          return extension && _loader.extensions.includes(extension);
        }
      });

      if (loader) {
        loader.action(_resource);
      } else {
        console.warn(`Cannot find loader for resource: ${_resource.name}`);
      }
    }
  }

  fileLoadEnd(_resource, _data) {
    this.loaded++;
    this.items[_resource.name] = _data;
    const degrees = (this.loaded / this.toLoad) * 360;

    this.loadingScreen.style.setProperty("--p", degrees + "deg");

    this.trigger("fileEnd", [_resource, _data]);

    if (this.groups.current) {
      this.groups.current.loaded++;

      if (this.groups.current.loaded === this.groups.current.toLoad) {
        this.trigger("groupEnd", [this.groups.current]);
        this.groups.loaded.push(this.groups.current);

        if (this.groups.assets.length > 0) {
          this.loadNextGroup();
        }
      }
    }

    if (this.loaded === this.toLoad) {
      this.loadingScreen.classList.add("finished-load");

      setTimeout(() => {
        this.loadingScreen.textContent = "START";
        this.loadingScreen.style.cursor = "pointer";
        this.loadingScreen.classList.add("loading-screen-hover");
        this.loadingScreen.classList.remove("finished-load");

        const clickHandler = () => {
          const audioManager = this.experience.world.audioManager;
          audioManager.playSingleAudio("start", 0.4);
          audioManager.playLoopAudio("floral", 0.1);
          this.audioButton.classList.add("show-audio-button");
          this.loadingScreen.classList.remove("show-loading-screen");
          this.removeOverlay();
          this.loadingScreen.removeEventListener("click", clickHandler);
        };
        this.loadingScreen.addEventListener("click", clickHandler);
      }, 1000);

      this.trigger("end");
    }
  }
}
