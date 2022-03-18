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

export const getDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export const timeToPixels = (time) => {
    const [h, m] = time.split(':')
    return (+h + +m / 60) * hourHeight
}