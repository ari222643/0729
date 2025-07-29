// 지원금 데이터 (실제 서비스에서는 API에서 가져올 데이터)
const supportData = {
    seoul: {
        '20s': [
            {
                title: '서울시 청년 건강검진 지원',
                amount: '최대 10만원',
                target: '만 19-34세 서울시 거주 청년',
                period: '2024.03.01 ~ 2024.12.31',
                method: '서울시 청년포털 온라인 신청',
                description: '서울시에 거주하는 청년들의 건강관리를 위한 건강검진 비용 지원 사업입니다.',
                details: '기본 건강검진 외 추가 검사 항목 지원 가능하며, 연 1회 신청 가능합니다.',
                urgent: true,
                link: 'https://youth.seoul.go.kr'
            },
            {
                title: '1인 가구 여성 안심 건강검진',
                amount: '최대 15만원',
                target: '만 20-39세 1인 가구 여성',
                period: '2024.01.01 ~ 2024.12.31',
                method: '서울시 여성가족재단 신청',
                description: '1인 가구 여성의 건강관리를 위한 맞춤형 건강검진 지원 프로그램입니다.',
                details: '부인과 검진, 유방암 검진 등 여성 특화 검진 항목을 중점적으로 지원합니다.',
                urgent: false,
                link: 'https://seoulwomen.or.kr'
            }
        ],
        '30s': [
            {
                title: '서울시 직장인 건강검진 지원',
                amount: '최대 8만원',
                target: '만 30-39세 서울시 직장인',
                period: '2024.01.01 ~ 2024.12.31',
                method: '서울시 보건소 방문 신청',
                description: '직장인의 건강관리를 위한 추가 건강검진 비용 지원 사업입니다.',
                details: '국가건강검진 외 추가 검사 항목에 대한 비용을 지원합니다.',
                urgent: false,
                link: 'https://health.seoul.go.kr'
            }
        ]
    },
    busan: {
        '20s': [
            {
                title: '부산시 청년 건강관리 지원',
                amount: '최대 12만원',
                target: '만 19-34세 부산시 거주 청년',
                period: '2024.02.01 ~ 2024.11.30',
                method: '부산시청 온라인 신청',
                description: '부산시 청년들의 건강증진을 위한 건강검진 비용 지원 사업입니다.',
                details: '기본 검진 외 정신건강 상담도 함께 지원합니다.',
                urgent: true,
                link: 'https://www.busan.go.kr'
            }
        ]
    }
};

// 임산부, 장애인 등 특별 조건별 지원금
const specialSupports = {
    pregnant: [
        {
            title: '임산부 산전검사 지원',
            amount: '전액 무료',
            target: '임신 확인된 모든 임산부',
            period: '연중 상시',
            method: '거주지 보건소 방문',
            description: '임산부와 태아의 건강을 위한 필수 산전검사 비용을 전액 지원합니다.',
            details: '초음파 검사, 기형아 검사, 임신성 당뇨 검사 등이 포함됩니다.',
            urgent: false,
            link: 'https://www.mohw.go.kr'
        }
    ],
    disabled: [
        {
            title: '장애인 건강검진 지원',
            amount: '최대 20만원',
            target: '등록 장애인',
            period: '2024.01.01 ~ 2024.12.31',
            method: '거주지 보건소 신청',
            description: '장애인의 건강관리를 위한 맞춤형 건강검진 비용 지원 사업입니다.',
            details: '장애 유형별 특화 검진 항목을 포함하여 지원합니다.',
            urgent: false,
            link: 'https://www.mohw.go.kr'
        }
    ],
    'small-business': [
        {
            title: '소상공인 건강검진 지원',
            amount: '최대 25만원',
            target: '소상공인 및 가족',
            period: '2024.03.01 ~ 2024.10.31',
            method: '소상공인시장진흥공단 신청',
            description: '소상공인과 그 가족의 건강관리를 위한 건강검진 비용 지원 사업입니다.',
            details: '사업자등록증 보유 소상공인 및 배우자, 부양가족까지 지원 가능합니다.',
            urgent: true,
            link: 'https://www.semas.or.kr'
        }
    ]
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // FAQ 아코디언 기능
    initFAQ();
    
    // 폼 제출 이벤트
    document.getElementById('supportForm').addEventListener('submit', handleFormSubmit);
    
    // 스무스 스크롤
    initSmoothScroll();
});

// FAQ 아코디언 초기화
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // 모든 FAQ 아이템 닫기
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // 클릭된 아이템만 열기 (이미 열려있었다면 닫기)
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// 폼 제출 처리
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const region = formData.get('region');
    const age = formData.get('age');
    const occupation = formData.get('occupation');
    const income = formData.get('income');
    const conditions = formData.getAll('conditions');
    
    // 결과 찾기
    const results = findSupportPrograms(region, age, occupation, income, conditions);
    
    // 결과 표시
    displayResults(results);
    
    // 결과 섹션으로 스크롤
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// 지원금 프로그램 찾기
function findSupportPrograms(region, age, occupation, income, conditions) {
    let results = [];
    
    // 지역별, 연령별 지원금 찾기
    if (supportData[region] && supportData[region][age]) {
        results = [...supportData[region][age]];
    }
    
    // 특별 조건별 지원금 추가
    conditions.forEach(condition => {
        if (specialSupports[condition]) {
            results = results.concat(specialSupports[condition]);
        }
    });
    
    // 국가 기본 지원금 (모든 사용자에게 해당)
    const basicSupports = [
        {
            title: '국가건강검진 (일반검진)',
            amount: '전액 무료',
            target: '건강보험 가입자 및 피부양자',
            period: '연중 상시 (2년마다)',
            method: '국민건강보험공단 지정 검진기관',
            description: '국민건강보험공단에서 제공하는 기본 건강검진으로 본인부담금이 없습니다.',
            details: '신체계측, 혈액검사, 소변검사, 흉부X선 등 기본 검진 항목이 포함됩니다.',
            urgent: false,
            link: 'https://www.nhis.or.kr'
        }
    ];
    
    results = results.concat(basicSupports);
    
    return results;
}

// 결과 표시
function displayResults(results) {
    const resultsSection = document.getElementById('results');
    const resultsGrid = document.getElementById('resultsGrid');
    const resultsSummary = document.getElementById('results-summary');
    
    // 결과 요약 업데이트
    resultsSummary.textContent = `총 ${results.length}개의 지원금을 찾았습니다`;
    
    // 기존 결과 초기화
    resultsGrid.innerHTML = '';
    
    // 결과 카드 생성
    results.forEach((support, index) => {
        const card = createResultCard(support, index);
        resultsGrid.appendChild(card);
    });
    
    // 결과 섹션 표시
    resultsSection.style.display = 'block';
}

// 결과 카드 생성
function createResultCard(support, index) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    const urgentTag = support.urgent ? '<div class="urgent-tag">마감 임박!</div>' : '';
    
    card.innerHTML = `
        ${urgentTag}
        <div class="card-header">
            <h3 class="card-title">${support.title}</h3>
            <div class="support-amount">${support.amount}</div>
        </div>
        <div class="card-info">
            <div class="info-item">
                <i class="fas fa-users"></i>
                <span>${support.target}</span>
            </div>
            <div class="info-item">
                <i class="fas fa-calendar"></i>
                <span>${support.period}</span>
            </div>
            <div class="info-item">
                <i class="fas fa-file-alt"></i>
                <span>${support.method}</span>
            </div>
        </div>
        <div class="card-actions">
            <button class="detail-button" onclick="showDetail(${index})">
                상세보기
            </button>
            <button class="apply-button" onclick="window.open('${support.link}', '_blank')">
                신청하기
            </button>
        </div>
    `;
    
    return card;
}

// 상세 정보 모달 표시
function showDetail(index) {
    const modal = document.getElementById('detailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const applyButton = document.getElementById('applyButton');
    
    // 현재 표시된 결과에서 해당 인덱스의 데이터 가져오기
    const cards = document.querySelectorAll('.result-card');
    const cardTitle = cards[index].querySelector('.card-title').textContent;
    
    // 임시로 첫 번째 지원금 데이터 사용 (실제로는 인덱스로 매칭)
    const support = {
        title: cardTitle,
        description: '해당 지원금에 대한 상세 설명입니다.',
        details: '신청 자격, 필요 서류, 지원 내용 등에 대한 자세한 정보입니다.',
        requirements: ['거주지 확인서류', '소득증명서', '신분증 사본'],
        link: '#'
    };
    
    modalTitle.textContent = support.title;
    modalBody.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <h4 style="margin-bottom: 0.5rem; color: #1e293b;">지원 내용</h4>
            <p style="color: #64748b; line-height: 1.6;">${support.description}</p>
        </div>
        <div style="margin-bottom: 1.5rem;">
            <h4 style="margin-bottom: 0.5rem; color: #1e293b;">상세 정보</h4>
            <p style="color: #64748b; line-height: 1.6;">${support.details}</p>
        </div>
        <div>
            <h4 style="margin-bottom: 0.5rem; color: #1e293b;">필요 서류</h4>
            <ul style="color: #64748b; padding-left: 1.5rem;">
                ${support.requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
        </div>
    `;
    
    applyButton.onclick = () => window.open(support.link, '_blank');
    
    modal.style.display = 'block';
}

// 모달 닫기
function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('detailModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// 스무스 스크롤 초기화
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// CTA 버튼 클릭 시 폼으로 스크롤
function scrollToForm() {
    document.getElementById('guide').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// 페이지 스크롤 시 헤더 효과
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

