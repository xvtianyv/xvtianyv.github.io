// blog-list.js (With Topics)

// ==================================================
// 1. 文章列表 (Post List)
// ==================================================
const posts = [
    { file: "blogs/style-guide.html", title: "样式说明手册 (Style Guide)", date: "2025-09-23", summary: "本文档是一个动态的说明手册，展示了所有可用的文章样式及其对应的HTML源代码，方便您复制和使用。" },
    { file: "blogs/new-post.html", title: "一篇关于CSS的文章", date: "2025-09-22", summary: "深入探讨现代CSS的特性和技巧，以及如何在项目中优雅地使用它们。" },
    { file: "blogs/another-post.html", title: "JavaScript异步编程", date: "2025-09-22", summary: "从回调地狱到Promise，再到Async/Await，一文理清JavaScript的异步发展史。" },
    { file: "blogs/dev-log.html", title: "开发日志：重构本站", date: "2025-09-20", summary: "记录了本次博客列表页面的重构过程，包括遇到的问题和解决方案。" },
    { file: "blogs/post2.html", title: "关于技术的一些思考", date: "2025-09-18", summary: "这是第二篇文章的正文。探索技术的无限可能性。Cras id urna. Morbi tincidunt, orci ac convallis aliquam..." },
    { file: "blogs/web-perf.html", title: "前端性能优化指南", date: "2025-09-18", summary: "从图片优化到代码分割，全面介绍提升网站加载速度和运行性能的策略。" },
    { file: "blogs/design-patterns.html", title: "设计模式入门", date: "2025-09-15", summary: "介绍几种常见的设计模式，如单例、工厂和观察者模式，并提供代码示例。" }
];

// ==================================================
// 2. 专题列表 (Topic List)
// ==================================================
const topics = [
    {
        name: "前端基础",
        description: "涵盖 HTML, CSS 和 JavaScript 的核心知识与实践。",
        // 将文章的`title`添加到下面的数组中，即可完成归纳
        postTitles: ["一篇关于CSS的文章", "JavaScript异步编程", "前端性能优化指南"]
    },
    {
        name: "项目开发",
        description: "记录项目开发过程中的思考、复盘与总结。",
        postTitles: ["开发日志：重构本站"]
    },
    {
        name: "计算机通用知识",
        description: "分享数据结构、设计模式等通用的编程知识。",
        postTitles: ["设计模式入门"]
    }
];


// ==================================================
// 3. 页面生成逻辑 (Page Generation Logic)
// ==================================================
document.addEventListener('DOMContentLoaded', () => {
    const timelineTrack = document.getElementById('timeline-track');
    const postGrid = document.getElementById('post-grid');
    const topicGrid = document.getElementById('topic-grid'); // New topic grid container

    if (!timelineTrack || !postGrid || !topicGrid) return;

    // --- Sort and Generate Posts and Timeline ---
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    const dateToNodeMap = new Map();
    const postElements = [];
    const dateToPostId = new Map();

    posts.forEach((post, index) => {
        const postDate = post.date;
        const postElementId = `post-item-${index}`;
        const postItem = document.createElement('article');
        postItem.className = 'post-item';
        postItem.id = postElementId;
        postItem.innerHTML = `<a href="${post.file}"><h3>${post.title}</h3><p class="meta">发布于 ${post.date}</p><p>${post.summary}</p></a>`;
        postGrid.appendChild(postItem);
        postElements.push(postItem);

        if (!dateToNodeMap.has(postDate)) {
            const timelineNode = document.createElement('div');
            timelineNode.className = 'timeline-node';
            timelineTrack.appendChild(timelineNode);
            timelineNode.innerHTML = `<div class="timeline-date">${post.date.substring(5)}</div><div class="timeline-point"></div>`;
            dateToNodeMap.set(postDate, timelineNode);
            dateToPostId.set(postDate, postElementId);
        }
    });

    // --- Generate Topics ---
    topics.forEach(topic => {
        const topicCard = document.createElement('div');
        topicCard.className = 'topic-card';

        let postLinksHtml = '';
        topic.postTitles.forEach(postTitle => {
            const postData = posts.find(p => p.title === postTitle);
            if (postData) {
                postLinksHtml += `<li><a href="${postData.file}">${postData.title}</a></li>`;
            }
        });

        topicCard.innerHTML = `
            <h3>${topic.name}</h3>
            <p>${topic.description}</p>
            <ul>${postLinksHtml}</ul>
        `;
        topicGrid.appendChild(topicCard);
    });


    // --- Interaction Logic ---
    let animationFrameId = null;
    let isTimelineClicked = false;
    let clickTimeout;

    timelineTrack.addEventListener('click', (event) => {
        const node = event.target.closest('.timeline-node');
        if (!node) return;
        const postDate = node.querySelector('.timeline-date').innerText.replace(/(\d{2})-(\d{2})/, '2025-$1-$2');
        const targetPostId = dateToPostId.get(postDate);
        const targetElement = document.getElementById(targetPostId);
        if (targetElement) {
            isTimelineClicked = true;
            clearTimeout(clickTimeout);
            const timelineNode = dateToNodeMap.get(postDate);
            if (timelineNode) {
                const translateX = -timelineNode.offsetLeft;
                timelineTrack.style.transform = `translateX(${translateX}px)`;
            }
            const scrollLeft = targetElement.offsetLeft - 30;
            postGrid.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            clickTimeout = setTimeout(() => { isTimelineClicked = false; }, 800);
        }
    });

    function onPostGridScroll() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => {
            if(isTimelineClicked) return;
            let currentPost = postElements[0];
            for (const postEl of postElements) {
                if (postEl.offsetLeft >= postGrid.scrollLeft) {
                    currentPost = postEl;
                    break;
                }
            }
            if (!currentPost) currentPost = postElements[postElements.length - 1];
            const currentPostData = posts.find(p => p.title === currentPost.querySelector('h3').innerText);
            if (!currentPostData) return;
            const timelineNode = dateToNodeMap.get(currentPostData.date);
            if (timelineNode) {
                const translateX = -timelineNode.offsetLeft;
                timelineTrack.style.transform = `translateX(${translateX}px)`;
            }
        });
    }
    postGrid.addEventListener('scroll', onPostGridScroll);
    onPostGridScroll();
});
