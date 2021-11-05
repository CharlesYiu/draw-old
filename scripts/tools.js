const shapesElement = document.getElementById("shapes")
const actionTypes = {draw: "draw"}
let actions = []

let lineColor = {r: 0, g: 0, b: 0, a: 1}
let thickness = 10
let usingTool = false
let refreshOnDistance = 10

function formatColor(color) {
    return(`rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ? color.a : 1})`)
}
function generateRandomId(characterCount) {
    id = [...Array(characterCount)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
    while (document.getElementById(id)) {
        id = [...Array(characterCount)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
    }
    return(id)
}

function toggleUsingTool() {
    const overlayElement = document.getElementById(elementIds.overlayDiv)
    usingTool = !usingTool
    overlayElement.style.opacity = usingTool ? "50%" : "100%"
    overlayElement.style.pointerEvents = usingTool ? "none" : "all"
}
function setTool(tool) { shapesElement.onmousedown = tool }

function drawLine(shapeElement, createLine, drawnLine) {
    const lineId = generateRandomId(7)
    let cursor = [window.event]
    const position = {x: cursor[0].clientX, y: cursor[0].clientY}
    let updating = false
    function updateLine() {
        if (updating) { return }
        updating = true
        window.event.preventDefault()

        cursor = [window.event]
        if (createLine) { createLine({shape: shapeElement, lineId: lineId, originalX: position.x, originalY: position.y, currentX: cursor[0].clientX, currentY: cursor[0].clientY}) }
        else {
            shapeElement.lines.pop()
            shapeElement.appendLine(lineId, {x: position.x - shapeElement.x, y: position.y - shapeElement.y}, {x: cursor[0].clientX - shapeElement.x, y: cursor[0].clientY - shapeElement.y})
            shapeElement.refresh()
        }
        updating = false
    }
    function finalLine() {
        shapesElement.onmousemove = null
        shapesElement.onmouseup = null
        if (drawnLine) { drawnLine({shape: shapeElement, lineId: lineId, originalX: position.x, originalY: position.y, currentX: cursor[0].clientX, currentY: cursor[0].clientY}) }
    }
    shapesElement.onmousemove = updateLine
    shapesElement.onmouseup = finalLine
}

function lineTool() {
    if (usingTool) { return }
    toggleUsingTool()

    const lineElement = document.createElement("div")
    lineElement.id = generateRandomId(7)
    shapesElement.appendChild(lineElement)

    const lineShape = shapify(lineElement)
    lineShape.x = 0
    lineShape.y = 0
    lineShape.lineColor = formatColor(lineColor)
    lineShape.lineWidth = thickness

    drawLine(lineShape, null ,() => {
        toggleUsingTool()
        actions.push({type: actionTypes.draw, element: lineElement, shape: lineShape})
    })
}

function squareTool() {
    if (usingTool) { return }
    toggleUsingTool()

    const squareElement = document.createElement("div")
    squareElement.id = generateRandomId(7)
    shapesElement.appendChild(squareElement)

    const squareShape = shapify(squareElement)
    squareShape.x = 0
    squareShape.y = 0
    squareShape.lineColor = formatColor(lineColor)
    squareShape.lineWidth = thickness

    let movedDistance = 0

    function createSquare(context) { // TODO fix line spawning ( usually spawns 3 more lines than expected)
        const lineId = generateRandomId(7)
        context.shape.lines = [
            {id: `${lineId}-1`, a: {x: context.originalX, y: context.originalY}, b: {x: context.originalX, y: context.currentY}},
            {id: `${lineId}-2`, a: {x: context.originalX, y: context.originalY}, b: {x: context.currentX, y: context.originalY}},
            {id: `${lineId}-3`, a: {x: context.currentX, y: context.currentY}, b: {x: context.originalX, y: context.currentY}},
            {id: `${lineId}-4`, a: {x: context.currentX, y: context.currentY}, b: {x: context.currentX, y: context.originalY}}
        ]
        context.shape.refresh()
    }

    drawLine(squareShape, createSquare, context => {
        createSquare(context)
        actions.push({type: actionTypes.draw, element: squareElement, shape: squareShape})
        toggleUsingTool()
    })
}

function scribbleTool() {
    if (usingTool) { return }
    toggleUsingTool()

    const scribbleElement = document.createElement("div")
    scribbleElement.id = generateRandomId(7)
    shapesElement.appendChild(scribbleElement)

    const scribbleShape = shapify(scribbleElement)
    scribbleShape.x = 0
    scribbleShape.y = 0
    scribbleShape.lineColor = formatColor(lineColor)
    scribbleShape.lineWidth = thickness

    let lastPosition = {}
    let movedDistance = 0

    function scribble(shapeElement, a, b) {
        shapeElement.appendLine(generateRandomId(10), a, b)
        if (movedDistance < refreshOnDistance) { movedDistance += distanceFromAtoB(a, b) }
        else {
            movedDistance = 0
            shapeElement.refresh()
        }
    }

    function createScribble(context) {
        if (lastPosition === {}) { lastPosition = {x: context.originalX, y: context.originalY} }
        scribble(context.shape, lastPosition, {x: context.currentX, y: context.currentY})
        lastPosition = {x: context.currentX, y: context.currentY}
    }

    drawLine(scribbleShape, createScribble, context => {
        actions.push({type: actionTypes.draw, element: scribbleElement, shape: scribbleShape})
        toggleUsingTool()
    })
}

function initializeTools() {
    document.getElementById(elementIds.toolsSettingsScribbleToolButton).onclick = () => { setTool(scribbleTool) }
    document.getElementById(elementIds.toolsSettingsLineToolButton).onclick = () => { setTool(lineTool) }
    document.getElementById(elementIds.toolsSettingsSquareToolButton).onclick = () => { setTool(squareTool) }
}