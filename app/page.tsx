'use client';
import { useState, useEffect } from 'react';
import ModelView from './component/ModelView';
import Image from 'next/image';
import useScrollPosition from '@/hooks/useScrollPosition';
import styles from './page.module.css';

const DynamicTitle = ({ children }: { children: React.ReactNode }) => {
    const scrollY = useScrollPosition();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Set initial value
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 1. 최소/최대 폰트 크기 정의 (px)
    const MIN_FONT_SIZE = 40;
    const MAX_FONT_SIZE = 100;

    // 2. 폰트 크기가 변경될 스크롤 범위 정의 (px)
    let scrollRange = 100; // 스크롤 0px ~ 500px 사이에서 폰트 크기 변경

    let newFontSize = MAX_FONT_SIZE;

    if (isMobile) {
        newFontSize = 60;
        scrollRange = 20;
    } else if (scrollY <= scrollRange) {
        // 스크롤 비율 계산 (0 ~ 1)
        const scrollRatio = scrollY / scrollRange;

        // 💡 변경된 로직: 최대 크기에서 감소분을 읍니다.
        // (최대 크기 - 최소 크기) * 비율 => 스크롤이 내려갈수록 0부터 (최대-최소)까지 증가
        const sizeDecrease = (MAX_FONT_SIZE - MIN_FONT_SIZE) * scrollRatio;

        // 계산된 감소분을 최대 크기에서 뺍니다.
        newFontSize = MAX_FONT_SIZE - sizeDecrease;

        // 폰트 크기를 최소/최대 범위 내로 고정
        newFontSize = Math.min(Math.max(newFontSize, MIN_FONT_SIZE), MAX_FONT_SIZE);
    } else {
        // 정의된 스크롤 범위를 벗어나면 최소 크기로 고정
        newFontSize = MIN_FONT_SIZE;
    }
    const isFixed = scrollY > scrollRange;

    // 계산된 폰트 크기를 정수로 만듭니다.
    const dynamicFontSize = Math.round(newFontSize);

    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: 100,
                zIndex: 1000,
                transition: 'all 0.05s ease-out',
                textAlign: 'center',
                fontFamily: 'var(--font-bebas-neue)',
                fontWeight: 'bold',
            }}>
            <h1 style={{ paddingTop: 5, backgroundColor: isFixed ? 'var(--background)' : 'transparent', fontSize: `${dynamicFontSize}px`, transition: isMobile ? 'none' : 'all 0.05s ease-out' }}>{children}</h1>
            <div
                style={{
                    height: '2px', // 선의 두께
                    backgroundColor: '#333', // 선의 색상
                    margin: '0 auto 0 auto', // 상단 여백 및 중앙 정렬

                    // 💡 애니메이션 핵심 로직:
                    // isFixed가 true면 width 100%, 아니면 0%
                    width: isFixed ? '100%' : '0%',
                    opacity: isFixed ? 1 : 0, // isFixed가 true면 나타나고 아니면 투명하게

                    // 💡 너비와 투명도 변화에 transition 적용
                    transition: 'width 0.5s ease-out, opacity 0.5s ease-out',

                    // (선택 사항) 중앙에서 양옆으로 확장되는 것처럼 보이게 하려면 transform 사용
                    // transform: isFixed ? 'scaleX(1)' : 'scaleX(0)',
                    // transformOrigin: 'center', // 중앙을 기준으로 확장
                }}
            />
        </header>
    );
};

export default function Home() {
    const models = ['FuzzFactory', 'BigMuff'];
    const [resetToggle, setResetToggle] = useState(false);

    const onResetClicked = () => {
        setResetToggle((prev) => !prev);
    };

    return (
        <div className={styles.container}>
            <DynamicTitle>Swanwoo Pedals</DynamicTitle>
            <div style={{ paddingBottom: 0, fontSize: 30, fontFamily: 'var(--font-bebas-neue)', fontWeight: 'bold', textAlign: 'center' }}>
                <a style={{ display: 'inline-block' }} href='https://www.instagram.com/swanwoo_pedals/' target='_blank'>
                    <Image width={40} height={40} src='/instagram.webp' alt='instagram' />
                </a>
            </div>
            <div style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 20 }}>
                <div style={{ fontSize: 25, fontFamily: 'var(--font-bebas-neue)', color: 'grey', textAlign: 'center' }}>{'DIY Effects Pedals'}</div>
                <div style={{ fontSize: 25, fontFamily: 'var(--font-bebas-neue)', color: 'grey', textAlign: 'center' }}>{'Custom Illustrating, Hand-Wiring'}</div>
                <div style={{ fontSize: 25, fontFamily: 'var(--font-bebas-neue)', color: 'grey', textAlign: 'center' }}>{'Base In Incheon, Korea'}</div>
            </div>
            <div className={styles.modelContainer}>
                <div className={styles.modelView}>
                    <ModelView name={models[0]} resetToggle={resetToggle} />
                </div>
                <div className={styles.modelView}>
                    <ModelView name={models[1]} resetToggle={resetToggle} />
                </div>
                <div className={styles.modelView}></div>
            </div>
            <div style={{ backgroundColor: 'black', textAlign: 'center', fontFamily: 'var(--font-bebas-neue)', fontSize: 60, padding: 100 }}>{'More to come...'}</div>
            <footer>
                <div style={{ padding: 16, fontSize: 14, textAlign: 'center', color: 'grey' }}>{'Copyright 2025. @swanwoo_pedals All rights reserved.'}</div>
            </footer>
        </div>
    );
}
