
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface FullscreenManagerProps {
  children: React.ReactNode;
  onSubmit: () => void;
}

const FullscreenManager: React.FC<FullscreenManagerProps> = ({ 
  children,
  onSubmit
}) => {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [exitWarningCount, setExitWarningCount] = useState(0);
  const MAX_WARNINGS = 3;

  // Enter fullscreen on component mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        const docElement = document.documentElement;
        if (docElement.requestFullscreen) {
          await docElement.requestFullscreen();
          setIsFullscreen(true);
          toast.info("Entered fullscreen mode");
        }
      } catch (error) {
        console.error("Failed to enter fullscreen mode:", error);
        toast.error("Failed to enter fullscreen mode");
      }
    };

    enterFullscreen();

    // Prevent tab switching with visibility API
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        toast.warning("Leaving the tab will be counted as a warning!");
        handleExitAttempt();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (!isCurrentlyFullscreen) {
        handleExitAttempt();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle copy/paste prevention
  useEffect(() => {
    const preventCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.warning("Copy and paste are disabled in this mode");
    };

    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);

    return () => {
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
      document.removeEventListener('cut', preventCopyPaste);
    };
  }, []);

  const handleExitAttempt = useCallback(() => {
    const newCount = exitWarningCount + 1;
    setExitWarningCount(newCount);
    
    if (newCount < MAX_WARNINGS) {
      toast.warning(`Exiting fullscreen: Warning ${newCount}/${MAX_WARNINGS}`, {
        icon: <AlertTriangle className="h-4 w-4" />,
        description: `Your work will be automatically submitted after ${MAX_WARNINGS} warnings.`
      });
      
      // Re-enter fullscreen after warning if possible
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(err => {
          console.error(`Error attempting to re-enable fullscreen: ${err.message}`);
        });
      }
    } else {
      toast.error("Maximum warnings reached. Your work will be submitted and the session will end.", {
        duration: 5000
      });
      
      // Submit the work and exit
      onSubmit();
      setTimeout(() => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        navigate('/dashboard');
      }, 3000);
    }
  }, [exitWarningCount, navigate, onSubmit]);

  return (
    <div className="fullscreen-container">
      {isFullscreen && (
        <div className="fixed top-0 right-0 bg-red-600 text-white px-2 py-1 text-xs z-50">
          Fullscreen Mode - Exit Warning: {exitWarningCount}/{MAX_WARNINGS}
        </div>
      )}
      {children}
    </div>
  );
};

export default FullscreenManager;
