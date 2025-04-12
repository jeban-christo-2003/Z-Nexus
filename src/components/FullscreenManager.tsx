
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize, AlertTriangle } from 'lucide-react';

interface FullscreenManagerProps {
  children: React.ReactNode;
  onSubmit?: () => void;
  onExit?: () => void;
}

const FullscreenManager: React.FC<FullscreenManagerProps> = ({ 
  children, 
  onSubmit,
  onExit
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Detect fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement = 
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement;
      
      setIsFullscreen(!!fullscreenElement);
      
      // If exiting fullscreen and callback provided
      if (!fullscreenElement && isFullscreen && onExit) {
        onExit();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Handle tab switching/visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isFullscreen && onExit) {
        onExit();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isFullscreen, onExit]);

  // Auto-enable fullscreen on mount
  useEffect(() => {
    const enableFullscreen = async () => {
      try {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if ((docEl as any).mozRequestFullScreen) {
          await (docEl as any).mozRequestFullScreen();
        } else if ((docEl as any).webkitRequestFullscreen) {
          await (docEl as any).webkitRequestFullscreen();
        } else if ((docEl as any).msRequestFullscreen) {
          await (docEl as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      } catch (error) {
        console.error('Error attempting to enable fullscreen:', error);
      }
    };
    
    if (!isFullscreen) {
      enableFullscreen();
    }
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if ((docEl as any).mozRequestFullScreen) {
          await (docEl as any).mozRequestFullScreen();
        } else if ((docEl as any).webkitRequestFullscreen) {
          await (docEl as any).webkitRequestFullscreen();
        } else if ((docEl as any).msRequestFullscreen) {
          await (docEl as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Error attempting to toggle fullscreen:', error);
    }
  };

  // Keyboard handler for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default Escape key behavior
      if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault();
        
        // Custom handling for Escape key
        if (onExit) {
          onExit();
        }
        
        // Re-enable fullscreen after a small delay
        setTimeout(() => {
          if (!isFullscreen) {
            toggleFullscreen();
          }
        }, 100);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, onExit]);

  return (
    <>
      {children}
      
      {!isFullscreen && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            onClick={toggleFullscreen}
            className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
          >
            <Maximize className="h-4 w-4" />
            Enter Fullscreen Mode
          </Button>
        </div>
      )}
      
      {!isFullscreen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg max-w-md text-center">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Fullscreen Required</h2>
            <p className="mb-4">To prevent cheating, you must enter fullscreen mode to continue the coding test.</p>
            <Button 
              onClick={toggleFullscreen}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Enter Fullscreen Mode
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default FullscreenManager;
