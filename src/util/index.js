export const getHourArray = () => {
    const arr = new Array(24)
    for (let i = 0; i < arr.length; i++) {
        arr[i] = `${i}:00`
    }
    return arr
}

export const hourHeight = 50

export const heightToTime = (height) => {
    const h = Math.floor(height / hourHeight)
    const m = Math.floor(height % hourHeight / hourHeight * 4) * 15
    return `${h}:${m.toString().padStart(2, '0')}`
}

// дата формата 'yyyy-mm-dd' из объекта date
export const getDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export const timeToPixels = (time) => {
    const [h, m] = time.split(':')
    return (+h + +m / 60) * hourHeight
}

export const colorArray = ['fuchsia', 'red', 'green', 'yellow', 'blue']

export const getDayIndex = (date) => {
    if (date.getDay() === 0) {
        return 6
    }
    return date.getDay() - 1
}

export const getDayOffName = (date) => {
    date = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    switch (date) {
        case '01-01': return 'Новый год'
        case '01-07': return 'Рождество христово'
        case '02-23': return 'День защитника отечества'
        case '03-08': return 'Международный женский день'
        case '05-01': return 'Праздник Весны и Труда'
        case '05-09': return 'День Победы'
        case '06-12': return 'День России'
        case '11-04': return 'День народного единства'
        default: return 'Выходной'
    }
}

export const taskControlModalWindowHeight = 105

export const taskControlModalWindowWidth = 150