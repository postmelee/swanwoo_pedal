import { useState, useEffect, useRef } from 'react';

// 💡 스크롤 위치를 추적하는 커스텀 훅
const THROTTLE_DELAY = 10;

const useScrollPosition = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const lastRan = useRef(Date.now());
    useEffect(() => {
        const updatePosition = () => {
            const now = Date.now();
            // 💡 스로틀링 핵심 로직
            // 마지막 실행 시간으로부터 THROTTLE_DELAY만큼 시간이 지났는지 확인
            if (now - lastRan.current >= THROTTLE_DELAY) {
                // 시간이 지났으면 상태 업데이트
                setScrollPosition(window.scrollY);
                // 마지막 실행 시간을 현재 시간으로 갱신
                lastRan.current = now;
            }
            // 시간이 지나지 않았으면 아무것도 하지 않고 다음 이벤트 대기
        };

        // 💡 이벤트 리스너 등록: 스크롤 이벤트가 발생할 때마다 위치 업데이트
        window.addEventListener('scroll', updatePosition);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거 (클린업 함수)
        return () => window.removeEventListener('scroll', updatePosition);
    }, []);

    return scrollPosition;
};

export default useScrollPosition;
