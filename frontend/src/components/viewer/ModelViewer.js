import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  PresentationControls,
  ContactShadows,
  Html
} from '@react-three/drei';

// Component to load and display the 3D model
const Model = ({ modelUrl }) => {
  const { scene } = useGLTF(modelUrl);
  const modelRef = useRef();
  
  // Rotate the model slightly
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  // Center and scale the model
  useEffect(() => {
    if (modelRef.current) {
      // Reset position
      modelRef.current.position.set(0, 0, 0);
      
      // Adjust scale if needed
      modelRef.current.scale.set(1, 1, 1);
    }
  }, []);

  return <primitive ref={modelRef} object={scene} />;
};

// Loading state
const LoadingModel = () => (
  <Html center>
    <div className="text-primary-600 bg-white p-4 rounded-md shadow-md">
      <div className="flex items-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading 3D model...</span>
      </div>
    </div>
  </Html>
);

// Main viewer component
const ModelViewer = ({ modelUrl }) => {
  const [loading, setLoading] = useState(true);

  // Handle model loading
  useEffect(() => {
    if (modelUrl) {
      // Preload the model
      const loader = new useGLTF.preload(modelUrl);
      loader.then(() => {
        setLoading(false);
      }).catch(err => {
        console.error('Error loading model:', err);
      });
    }
  }, [modelUrl]);

  return (
    <div className="w-full h-full">
      <Canvas 
        dpr={[1, 2]} 
        shadows
        camera={{ position: [0, 0, 4], fov: 50 }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <PresentationControls
          global
          rotation={[0, -Math.PI / 4, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          {loading ? (
            <LoadingModel />
          ) : (
            <Model modelUrl={modelUrl} />
          )}
        </PresentationControls>
        
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} blur={2.4} />
        <Environment preset="city" />
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true} 
        />
      </Canvas>
      
      <div className="absolute bottom-2 left-2 text-xs text-secondary-400 bg-white/80 px-2 py-1 rounded">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};

export default ModelViewer; 