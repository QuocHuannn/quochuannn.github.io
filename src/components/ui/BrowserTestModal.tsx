import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TestTube } from 'lucide-react';


interface BrowserTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BrowserTestModal: React.FC<BrowserTestModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 rounded-2xl shadow-2xl z-50 overflow-hidden"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 text-white rounded-lg">
                  <TestTube className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Browser Compatibility Test</h2>
                  <p className="text-sm text-gray-600">Test your browser's 3D capabilities</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TestTube className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Browser Test Complete</h3>
                <p className="text-gray-600 mb-4">
                  This portfolio no longer requires 3D capabilities testing.
                </p>
                <p className="text-sm text-gray-500">
                  Your browser is fully compatible with this website.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Hook for using the modal
export const useBrowserTestModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  
  return {
    isOpen,
    openModal,
    closeModal,
    BrowserTestModal: (props: Omit<BrowserTestModalProps, 'isOpen' | 'onClose'>) => (
      <BrowserTestModal {...props} isOpen={isOpen} onClose={closeModal} />
    )
  };
};

export default BrowserTestModal;