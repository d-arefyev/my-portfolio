// Импорт необходимых модулей из файлов data.js и utils.js
import { eventsStore } from './js/data.js'
import { createDomElement } from './js/utils.js'
import { formatDate } from './js/utils.js'

// Получение доступа к HTML-элементам страницы
const allEventsDiv = document.querySelector('.joinEvents__events-block')
const eventTypeSelect = document.getElementById('event-type')
const eventDistanceSelect = document.getElementById('event-distance')
const eventCategorySelect = document.getElementById('event-category')

// Функция для создания карточек событий
function createEvent(arr) {
    arr.forEach((eventElement) => {
        // Создание ссылки на событие
        const link = createDomElement({ tag: 'a', className: 'joinEvents__events-card', href: '#' })
        allEventsDiv.append(link)

        // Создание контейнера для изображения события
        const eventImageContainer = createDomElement({ tag: 'div', className: 'joinEvents__image-container' })
        link.append(eventImageContainer)

        // Создание изображения события
        const eventImage = createDomElement({ tag: 'img', className: 'joinEvents__image', src: eventElement.image })
        eventImageContainer.append(eventImage)

        // Создание контейнера для информации о событии
        const eventsDescription = createDomElement({ tag: 'div', className: 'joinEvents__card-info' })
        link.append(eventsDescription)

        // Создание элементов с информацией о событии
        const eventsDate = createDomElement({ tag: 'p', className: 'joinEvents__date', textValue: formatDate(eventElement.date) })
        const eventsHeader = createDomElement({ tag: 'h3', className: 'joinEvents__title', textValue: eventElement.title })
        const eventsCategory = createDomElement({ tag: 'p', className: 'joinEvents__category', textValue: eventElement.category })
        eventsDescription.append(eventsDate, eventsHeader, eventsCategory)

        // Если событие является онлайн-событием, добавить метку "Online Event"
        if (eventElement.type === 'online') {
            const onlineEventLabel = createDomElement({
                tag: 'div',
                className: 'onlineEvent-label',
            });
            const textNode = document.createTextNode('Online Event')
            onlineEventLabel.appendChild(textNode)
            eventImageContainer.insertBefore(onlineEventLabel, eventImageContainer.firstChild)
        }

        // Если для события указано количество участников, добавить информацию о них
        if (eventElement.attendees) {
            const eventsAtendees = createDomElement({
                tag: 'p',
                className: 'joinEvents__atendees',
                textValue: `${eventElement.attendees} attendees`,
            })
            eventsDescription.append(eventsAtendees)
        }
    })
}

// Функция для очистки всех событий
function clearEvents() {
    while (allEventsDiv.firstChild) {
        allEventsDiv.removeChild(allEventsDiv.firstChild)
    }
}

// Функция для фильтрации событий и их отображения
function filterEvents(arr) {
// Получение выбранных значений фильтров
    const selectedType = eventTypeSelect.value !== 'any' && eventTypeSelect.value;
    const selectedDistance = eventDistanceSelect.value !== 'any' && eventDistanceSelect.value;
    const selectedCategory = eventCategorySelect.value !== 'any' && eventCategorySelect.value;

    // Фильтрация массива событий в соответствии с выбранными параметрами
    let filteredArr = arr
    if (selectedType) {
        filteredArr = filteredArr.filter((element) => element.type === selectedType)
    }
    if (selectedDistance) {
        filteredArr = filteredArr.filter((element) => String(element.distance) === selectedDistance)
    }
    if (selectedCategory) {
        filteredArr = filteredArr.filter((element) => element.category === selectedCategory)
    }

    // Очистка текущих событий и отображение отфильтрованных событий
    clearEvents()
    createEvent(filteredArr)
}

// Добавление обработчиков событий на элементы фильтров
eventTypeSelect.addEventListener('change', () => { filterEvents(eventsStore) })
eventDistanceSelect.addEventListener('change', () => { filterEvents(eventsStore) })
eventCategorySelect.addEventListener('change', () => { filterEvents(eventsStore) })

// Отображение всех событий при загрузке страницы
createEvent(eventsStore)