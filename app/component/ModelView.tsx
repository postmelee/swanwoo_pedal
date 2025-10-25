'use client';

import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import React, { Suspense, Component, ErrorInfo, ReactNode, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { easing, geometry } from 'maath';
import useIsMobile from '@/hooks/useIsMobile';
interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

interface Spec {
    title: string;
    date: string;
    spec: string[];
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}>Error loading 3D model</div>;
        }

        return this.props.children;
    }
}

function Model({ name, group, isHover }: { name: string; group: React.RefObject<THREE.Group | null>; isHover: boolean }) {
    const isMobile = useIsMobile();
    const base = `/swanwoo_pedals_obj`;
    const deg90 = Math.PI / 2;
    const light = useRef<THREE.SpotLight | null>(null);
    // 모델별 쿼리로 r3f/loader 캐시 분리
    useFrame((state, delta) => {
        if (group && light && group.current && light.current) {
            if (isHover) {
                easing.dampE(group.current.rotation, [state.pointer.y * (Math.PI / 3) + 0.4, (-state.pointer.x * Math.PI) / 3, 0], 0.3, delta);
                easing.damp3(group.current.position, [0, 0, -(1 - Math.abs(state.pointer.x)) / 2], 1, delta);
                easing.damp3(light.current.position, [state.pointer.x * 3, 2.5, -state.pointer.y + 1], 0.2, delta);
            } else {
                easing.dampE(group.current.rotation, [0, 0, 0], 0.3, delta);
                easing.damp3(group.current.position, [0, 0, 0], 0.3, delta);
                easing.damp3(light.current.position, [0, 4, 2], 0.2, delta);
            }
        }
    });

    const result = useGLTF(base + '/' + name + '/usdz.glb');

    return (
        <group ref={group}>
            <spotLight angle={0.4} penumbra={1} ref={light} castShadow intensity={18} shadow-mapSize={1024} shadow-bias={-0.001}></spotLight>
            <primitive object={result.scene} scale={[15, 15, 15]} position={[0, 0, 0]} rotation={[deg90, -deg90, deg90 / 1.3]} />;
        </group>
    );
}

export default function ModelView({ name, resetToggle }: { name: string; resetToggle: boolean }) {
    const [specJson, setSpecJson] = useState<Spec | null>(null);
    const [isHover, setIsHover] = useState(false);
    const group = useRef<THREE.Group>(null);
    const base = `/swanwoo_pedals_obj`;

    useEffect(() => {
        fetch(base + '/' + name + '/spec.json')
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((json) => {
                setSpecJson(json);
            });
    }, []);

    const controlsRef = useRef<OrbitControlsImpl | null>(null);

    // 2. 초기화 함수 정의
    const resetCamera = () => {
        // ref.current가 controls 객체를 참조하는지 확인하고 reset()을 호출합니다.
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
    };

    useEffect(() => {
        resetCamera();
    }, [resetToggle]);

    const handleMouseLeave = useCallback(() => {
        console.log('mouse leave' + name);
        setIsHover(false);
    }, [name]);

    return (
        <div style={{ position: 'relative', flex: 1, width: '100%', height: '100%' }}>
            <div style={{ position: 'absolute', left: '50%', transform: 'translate(-50%, 0%)', width: '100%' }}>
                <div style={{ flex: 1, textAlign: 'center', color: 'white', fontSize: 37, fontFamily: 'var(--font-bebas-neue)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{specJson?.title}</div>
                <div style={{ flex: 1, textAlign: 'center', color: 'grey', fontSize: 18, fontFamily: 'var(--font-bebas-neue)' }}>{specJson?.date}</div>
            </div>
            <ErrorBoundary>
                <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading 3D Model...</div>}>
                    <Canvas key={name} onMouseEnter={() => setIsHover(true)} onMouseLeave={handleMouseLeave} camera={{ position: [0, 2, 3], fov: 50 }} style={{ height: 500 }}>
                        {/* 조명 추가 */}
                        <ambientLight intensity={0.5} />
                        {/* 환경 조명 */}
                        {/* 축 헬퍼 */}
                        {/* <axesHelper args={[3]} />
                        {/* 모델 */}
                        <Model key={name} name={name} group={group} isHover={isHover} />
                        {/* 카메라 컨트롤 */}
                        <OrbitControls ref={controlsRef} enablePan={false} enableZoom={false} enableRotate={false} autoRotate={false} autoRotateSpeed={1} maxDistance={3.5} minDistance={2.5} />
                    </Canvas>
                    <div>
                        <div
                            style={{
                                height: 4,
                                backgroundColor: 'grey',
                                width: isHover ? '100%' : '0%',
                                opacity: isHover ? 1 : 0, // isFixed가 true면 나타나고 아니면 투명하게

                                // 💡 너비와 투명도 변화에 transition 적용
                                transition: 'width 0.5s ease-out, opacity 0.3s ease-out',
                            }}
                        />
                        <div style={{ transition: 'color 0.5s ease-out', color: isHover ? 'white' : 'grey', fontSize: 26, fontFamily: 'var(--font-bebas-neue)' }}>{name}</div>
                        {specJson?.spec?.map((text) => (
                            <div style={{ color: 'grey' }} key={text}>
                                {text}
                            </div>
                        ))}
                    </div>
                </Suspense>
            </ErrorBoundary>
        </div>
    );
}
