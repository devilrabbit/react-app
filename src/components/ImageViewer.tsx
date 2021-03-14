import React, { useEffect, useState, ReactNode } from 'react';
import OpenSeaDragon from 'openseadragon';

interface ImageViewerProps {
  image?: string;
  children?: ReactNode;
}

const APPBAR_HEIGHT = '64px';

const ImageViewer: React.FC<ImageViewerProps> = (props: ImageViewerProps) => {
  const [viewer, setViewer] = useState<OpenSeaDragon.Viewer>();

  useEffect(() => {
    if (props.image && viewer) {
      viewer.open({
        tileSource: {
          type: 'image',
          url: props.image,
        },
      });
    }
  }, [props, viewer]);

  const destruct = () => {
    if (viewer) {
      viewer.destroy();
    }
  };

  const construct = () => {
    destruct();
    setViewer(
      OpenSeaDragon({
        id: 'osd-viewer',
        showNavigationControl: false,
        animationTime: 0.5,
        blendTime: 0.1,
        constrainDuringPan: true,
        maxZoomPixelRatio: 2,
        minZoomLevel: 1,
        visibilityRatio: 1,
        zoomPerScroll: 2,
        gestureSettingsMouse: {
          clickToZoom: false,
        },
      }),
    );
  };

  useEffect(() => {
    construct();
    return destruct;
  }, []);

  const nodes = React.Children.map(props.children, (child) => {
    switch (typeof child) {
      case 'string':
        return child;
      case 'object':
        return React.cloneElement(child as React.ReactElement<any>, { viewer });
      default:
        return null;
    }
  });

  return (
    <div
      id="osd-viewer"
      style={{
        width: '100%',
        height: `calc(100vh - ${APPBAR_HEIGHT})`,
      }}
    >
      {nodes}
    </div>
  );
};

export default ImageViewer;
