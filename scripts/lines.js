class shape {
    id = null
    x = null
    y = null
    lines = []
    lineWidth = 10
    lineColor = "black"
    debug = false
    appendLine(name, a, b) { this.lines.push({"id": name, "a": {"x": a.x, "y": a.y}, "b": {"x": b.x, "y": b.y}}) }
    removeLine(name) { delete this.lines.filter(line => {return line.id === name}) }
    toggleDebug() {
        this.debug = !this.debug
        const element = document.getElementById(this.id)
        this.lines.forEach(line => {
            const points = {"a": line.a, "b": line.b}
            for (const key in points) {
                const point = points[key]
                if (this.debug) {
                    const lineElementDebugPoint = document.createElement("div")
                    lineElementDebugPoint.setAttribute("name", `${this.id}-debug`)
                    lineElementDebugPoint.id = `${this.id}-${line.id}-${key}-point-debug`
                    lineElementDebugPoint.style.position = "fixed"
                    lineElementDebugPoint.style.left = `${(this.x + point.x) - this.lineWidth * 1.75}px`
                    lineElementDebugPoint.style.top = `${(this.y + point.y) - this.lineWidth * 1.75}px`
                    lineElementDebugPoint.style.width = `${this.lineWidth * 2.5}px`
                    lineElementDebugPoint.style.height = `${this.lineWidth * 2.5}px`
                    lineElementDebugPoint.style.border = `${this.lineWidth * 0.5}px solid white`
                    lineElementDebugPoint.style.backgroundColor = "black"
                    const lineElementDebugPointLabel = document.createElement("div")
                    lineElementDebugPointLabel.id = `${this.id}-${line.id}-${key}-point-debug-label`
                    lineElementDebugPointLabel.style.position = "fixed"
                    lineElementDebugPointLabel.style.left = `${this.x + point.x}px`
                    lineElementDebugPointLabel.style.top = `${this.y + point.y}px`
                    lineElementDebugPointLabel.style.backgroundColor = "white"
                    lineElementDebugPointLabel.innerHTML = `{'id': '${line.id}', '${key}': {'x': ${point.x}, 'y': ${point.y}}}`
                    lineElementDebugPoint.appendChild(lineElementDebugPointLabel)
                    element.appendChild(lineElementDebugPoint)
                } else {
                    document.getElementsByName(`${this.id}-debug`).forEach(debugElement => { element.removeChild(debugElement) })
                }
            }
        })
        if (this.debug) { element.style.border = `${this.lineWidth * 0.25}px solid gray` }
        else { element.style.border = null }
        console.log(`debug: ${this.debug}`)
    }
    refresh() {
        const element = document.getElementById(this.id)
        let totalLargestPointX = 0
        let totalLargestPointY = 0
        document.getElementsByName(`${this.id}-line`).forEach(lineElement => { element.removeChild(lineElement) })
        this.lines.forEach(line => {
            let largestPointX = 0
            let largestPointY = 0
            let smallestPointX = line.a.x
            let smallestPointY = line.a.y
            const points = {"a": line.a, "b": line.b}
            for (const key in points) {
                const point = points[key]
                if (point.x > largestPointX) { largestPointX = point.x }
                if (point.y > largestPointY) { largestPointY = point.y }
                if (point.x < smallestPointX) { smallestPointX = point.x }
                if (point.y < smallestPointY) { smallestPointY = point.y }
            }
            const distance = distanceFromAtoB(points.a, points.b) + this.lineWidth
            const degrees = degreesFromAtoB(points.a, points.b)
            const lineElement = document.createElement("div")
            lineElement.setAttribute("name", `${this.id}-line`)
            lineElement.id = `${this.id}-line-${line.id}`
            lineElement.style.position = "fixed"
            lineElement.style.borderRadius = `${this.lineWidth}px`
            lineElement.style.width = `${distance}px`
            lineElement.style.height = `${this.lineWidth}px`
            lineElement.style.left = `${(this.x + smallestPointX) - ((distance - (largestPointX - smallestPointX)) / 2)}px`
            lineElement.style.top = `${this.y + ((largestPointY + smallestPointY) / 2) - (this.lineWidth / 2)}px`
            lineElement.style.transform = `rotate(${degrees}deg)`
            lineElement.style.backgroundColor = this.lineColor
            element.appendChild(lineElement)
            if (largestPointX > totalLargestPointX) { totalLargestPointX = largestPointX }
            if (largestPointY > totalLargestPointY) { totalLargestPointY = largestPointY }
        })
        element.style.left = `${this.x - this.lineWidth * 0.75}px`
        element.style.top = `${this.y - this.lineWidth * 0.75}px`
        element.style.width = `${totalLargestPointX + this.lineWidth}px`
        element.style.height = `${totalLargestPointY + this.lineWidth}px`
        if (this.debug) {
            console.log(`--
{
    "id": ${this.id}, 
    "x": ${this.x - this.lineWidth * 0.75}, 
    "y": ${this.y - this.lineWidth * 0.75}, 
    "w": ${totalLargestPointX + this.lineWidth}, 
    "h": ${totalLargestPointY + this.lineWidth}, 
    "lines": ${this.lines.length}, 
    "lineWidth": ${this.lineWidth}, 
    "lineColor": ${this.lineColor}
}
--`)
        }
    }
}
function shapify(element) {
    element.style.position = "fixed"
    const shapeElement = new shape
    shapeElement.id = element.id
    shapeElement.x = element.left
    shapeElement.y = element.top
    return(shapeElement)
}
function linesToString(lines) {
    let linesString = ""
    lines.forEach(line => {
        linesString += `from {'x': ${line.a.x}, 'y': ${line.a.y}} to {'x': ${line.b.x}, 'y': ${line.b.y}},\n`
    })
    return(linesString)
}
function degreesFromAtoB(a, b) {
    const dx = a.x - b.x
    const dy = a.y - b.y
    let theta = Math.atan2(dy, dx)
    theta *= 180 / Math.PI
    return(theta)
}
function distanceFromAtoB(a, b) {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return(Math.sqrt(dx * dx + dy * dy))
}
