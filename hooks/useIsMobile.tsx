import { useState, useEffect } from 'react';

// 모바일 기준으로 사용할 화면 너비(Breakpoint)를 정의합니다.
const MOBILE_BREAKPOINT = 768; // 768px 미만을 모바일로 간주 (일반적인 태블릿/데스크탑 분기점)

function useIsMobile() {
    // 초기 상태는 window 객체에 접근할 수 없으므로 false 또는 null로 설정합니다.
    const [width, setWidth] = useState<number | null>(null);

    useEffect(() => {
        // SSR 단계에서는 실행되지 않도록 window가 존재하는지 확인합니다.
        if (typeof window === 'undefined') return;

        // 초기 로드 시 너비 설정
        setWidth(window.innerWidth);

        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        // resize 이벤트 리스너 추가
        window.addEventListener('resize', handleResize);

        // 컴포넌트 언마운트 시 리스너 제거
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // 화면 너비를 기준으로 모바일 여부 반환
    if (width === null) {
        return false; // SSR 또는 초기 렌더링 시 데스크탑 기본값을 반환
    }

    return width < MOBILE_BREAKPOINT;
}

export default useIsMobile;
