// 导航栏功能
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// 关闭移动端菜单
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// 平滑滚动到指定区域
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 当前作品管理
let currentSketch = null;
let currentSketchInstance = null;

// 加载作品
function loadSketch(sketchId) {
    const currentWorkSection = document.getElementById('current-work');
    const currentWorkTitle = document.getElementById('current-work-title');
    const currentSketchContainer = document.getElementById('current-sketch');
    
    // 清除之前的sketch
    if (currentSketchInstance) {
        currentSketchInstance.remove();
        currentSketchInstance = null;
    }
    
    // 设置作品标题
    const workTitles = {
        'sketch1': '动态粒子系统',
        'sketch2': '分形树生成器',
        'sketch3': '声音可视化',
        'sketch4': '神经网络可视化'
    };
    
    currentWorkTitle.textContent = workTitles[sketchId] || '作品展示';
    
    // 显示作品区域
    currentWorkSection.classList.add('active');
    
    // 滚动到作品区域
    setTimeout(() => {
        scrollToSection('current-work');
    }, 100);
    
    // 加载对应的sketch
    currentSketch = sketchId;
    loadSketchCode(sketchId, currentSketchContainer);
}

// 关闭当前作品
function closeCurrentWork() {
    const currentWorkSection = document.getElementById('current-work');
    currentWorkSection.classList.remove('active');
    
    if (currentSketchInstance) {
        currentSketchInstance.remove();
        currentSketchInstance = null;
    }
    
    currentSketch = null;
}

// 重置sketch
function resetSketch() {
    if (currentSketch && currentSketchInstance) {
        currentSketchInstance.remove();
        const currentSketchContainer = document.getElementById('current-sketch');
        loadSketchCode(currentSketch, currentSketchContainer);
    }
}

// 全屏切换
function toggleFullscreen() {
    const currentSketchContainer = document.getElementById('current-sketch');
    if (!document.fullscreenElement) {
        currentSketchContainer.requestFullscreen().catch(err => {
            console.log('全屏请求失败:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// 加载sketch代码
function loadSketchCode(sketchId, container) {
    // 这里会根据sketchId加载不同的Processing代码
    // 实际的sketch代码在sketches.js中定义
    if (typeof window[sketchId + 'Sketch'] === 'function') {
        currentSketchInstance = new p5(window[sketchId + 'Sketch'], container);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化首页sketch
    const heroSketchContainer = document.getElementById('hero-sketch');
    if (heroSketchContainer) {
        new p5(heroSketch, heroSketchContainer);
    }
    
    // 初始化预览sketches
    initializePreviewSketches();
    
    // 添加滚动动画
    addScrollAnimations();
});

// 初始化预览sketches
function initializePreviewSketches() {
    const previewIds = ['sketch1-preview', 'sketch2-preview', 'sketch3-preview', 'sketch4-preview'];
    
    previewIds.forEach((previewId, index) => {
        const container = document.getElementById(previewId);
        if (container) {
            const sketchId = 'sketch' + (index + 1);
            if (typeof window[sketchId + 'PreviewSketch'] === 'function') {
                new p5(window[sketchId + 'PreviewSketch'], container);
            }
        }
    });
}

// 添加滚动动画
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察所有需要动画的元素
    const animatedElements = document.querySelectorAll('.work-item, .contact-item, .skill-tag');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 键盘快捷键
document.addEventListener('keydown', function(event) {
    // ESC键关闭当前作品
    if (event.key === 'Escape') {
        closeCurrentWork();
    }
    
    // 数字键1-4快速加载作品
    if (event.key >= '1' && event.key <= '4') {
        const sketchId = 'sketch' + event.key;
        loadSketch(sketchId);
    }
});

// 窗口大小改变时重新调整
window.addEventListener('resize', function() {
    if (currentSketchInstance && currentSketchInstance.resizeCanvas) {
        const container = document.getElementById('current-sketch');
        if (container) {
            currentSketchInstance.resizeCanvas(container.offsetWidth, container.offsetHeight);
        }
    }
});

// 工具函数：生成随机颜色
function getRandomColor() {
    const colors = [
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
        '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 工具函数：生成随机数范围
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// 工具函数：限制数值范围
function constrain(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// 工具函数：映射数值范围
function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
} 