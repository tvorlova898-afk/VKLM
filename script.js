// ===============================================================
// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// ===============================================================

const quizSection = document.getElementById('quiz-section');
const resultSection = document.getElementById('result-section');
const btnDiscuss = document.getElementById('btn-discuss');
const btnMaterials = document.getElementById('btn-materials');


/**
 * Функция для рендеринга всех вопросов на основе конфига.
 */
function renderQuiz() {
    let htmlContent = '';
    
    // 1. Вопрос 1: Что продаёте? (products)
    htmlContent += renderQuestion('products', "Вопрос 1: Чем вы занимаетесь?", CONFIG.products);

    // 2. Вопрос 2: Что нужно? (goals)
    htmlContent += renderQuestion('goals', "Вопрос 2: Какая задача сейчас наиболее актуальна?", CONFIG.goals);

    // 3. Вопрос 3: Сколько ресурсов? (resources)
    htmlContent += renderQuestion('resources', "Вопрос 3: Какие ресурсы вы можете выделить на решение?";

    quizSection.innerHTML = htmlContent;
    setupEventListeners();
}


/**
 * Вспомогательная функция для создания HTML блока одного вопроса.
 * @param {string} key - Ключ типа вопросов (products, goals, resources).
 * @param {string} questionText - Текст заголовка вопроса.
 * @param {Array<Object>} options - Массив вариантов ответов.
 * @returns {string} HTML строка для блока.
 */
function renderQuestion(key, questionText = null, options) {
    let optionsHtml = '';

    if (typeof options === 'object' && !options[Symbol.iterator]) {
        // Если это случай, когда мы передаем только заголовок без опций (для следующего вопроса)
         return `<div class="question-block"><h4>${questionText || "Вопрос 3: Сколько ресурсов вы можете выделить на решение?"}</h4></div>`;
    }

    const title = questionText || `Выберите ответ по теме "${key.toUpperCase().replace('_', ' ')}".`;

    optionsHtml = options.map(option => `
        <label>
            <input type="radio" name="${key}" value="${option.id}" required>
            ${option.title}
        </label>
    `).join('');

    return `
        <div class="question-block" data-question-type="${key}">
            <h4>${title}</h4>
            <div class="options">
                ${optionsHtml}
            </div>
        </div>
    `;
}


/**
 * Устанавливает обработчики событий для всех радиокнопок и кнопки "Готово".
 */
function setupEventListeners() {
    const form = document.getElementById('quiz-section');

    // Добавляем кнопку отправки после вопросов (для удобства пользователя)
    let submitButtonHTML = `
        <button id="submit-quiz" class="action-button primary-btn" style="margin-top: 30px; width: auto;">Получить мою рекомендацию!</button>
    `;
    form.insertAdjacentHTML('beforeend', submitButtonHTML);

    // Слушатель для кнопки "Отправить"
    document.getElementById('submit-quiz').addEventListener('click', calculateResult);
}


/**
 * Главная функция: собирает ответы и вычисляет финальный результат.
 */
function calculateResult() {
    const form = document.getElementById('quiz-section');
    const inputs = form.querySelectorAll(`input[type="radio"]:checked`);

    if (inputs.length < 3) {
        alert("Пожалуйста, ответьте на все три вопроса, прежде чем получить результат!");
        return;
    }

    // Сбор ответов в формате {products: 'id', goals: 'id', resources: 'id'}
    const answers = {
        products: inputs[0].value, // Ответ 1 (Услуги/Товары/Обучение)
        goals: inputs[1].value,   // Ответ 2 (Продажи/Прогрев/Реактивация)
        resources: inputs[2].value  // Ответ 3 (Минимум/Средний/Максимум)
    };

    determineResult(answers);
}


/**
 * Определяет ключ результата по полученным ответам и отображает результат.
 * @param {Object} answers - Объект с ID выбранных вариантов.
 */
function determineResult(answers) {
    // Формирование ключа: product_goal_resource (например, services_sales_minimum)
    const key = `${answers.products}_${answers.goals}_${answers.resources}`;
    
    const resultData = CONFIG.results[key] || CONFIG.results['default'];

    if (!resultData) {
        console.error("Ключ результата не найден:", key);
        alert("Ошибка: Не удалось найти ваш результат. Попробуйте позже!");
        return;
    }

    // Скрытие секции опроса и показ результата
    document.getElementById('quiz-section').classList.add('hidden');
    resultSection.classList.remove('hidden');
    
    // Заполнение карточки результатов
    document.getElementById('result-title').textContent = resultData.title;
    document.getElementById('result-text').textContent = resultData.text;

    // Активация обработчиков кнопок с результатами
    setupResultButtons(key);
}


/**
 * Настройка логики для двух кнопок после получения результата.
 * @param {string} key - Ключ, который был использован для расчета (для потенциального бэкенд-трекинга).
 */
function setupResultButtons(key) {
    // 1. Кнопка "Обсудить результат" -> ВК ЛС
    btnDiscuss.onclick = () => {
        const personalMessagesUrl = CONFIG.personalMessagesUrl; // !!! ЗАМЕНИТЬ ССЫЛКУ !!!
        if (personalMessagesUrl && personalMessagesUrl !== "ВАША_ССЫЛКА_НА_ЛИЧНЫЕ_СООБЩЕНИЯ") {
            window.open(personalMessagesUrl, '_blank');
        } else {
            alert("Пожалуйста, настройте личные сообщения в config.js!");
        }
    };

    // 2. Кнопка "Получать полезные материалы" -> Ботхелп (Форма согласия)
    btnMaterials.onclick = () => {
        const botHelpUrl = "https://t.me/bothelp_username"; // !!! ЗАМЕНИТЬ ССЫЛКУ НА ВАШ БОТА-ПОМОЩНИКА !!!
        window.location.href = botHelpUrl;
    };
}

// Запуск приложения при загрузке DOM
document.addEventListener('DOMContentLoaded', renderQuiz);
