const barsContainer = document.getElementById('bars-container');
const generateBtn = document.getElementById('generateBtn');
const bubbleSortBtn = document.getElementById('bubbleSortBtn');
const mergeSortBtn = document.getElementById('mergeSortBtn');
const selectionSortBtn = document.getElementById('selectionSortBtn');
const insertionSortBtn = document.getElementById('insertionSortBtn');
const quickSortBtn = document.getElementById('quickSortBtn');
const shellSortBtn = document.getElementById('shellSortBtn');
const heapSortBtn = document.getElementById('heapSortBtn'); 
const speedSlider = document.getElementById('speedSlider');

let array = [];
let arrowPosition = -1; // Arrow position
let animationSpeed = 50; // Initial speed (milliseconds)

function generateArray(size = 50) {
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 300) + 10);
    }
    renderBars();
}

function renderBars() {
    barsContainer.innerHTML = '';
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';

        if (i < arrowPosition) {
            bar.classList.add('sorted'); 
        }

        bar.style.height = `${array[i]}px`;
        barsContainer.appendChild(bar);

        if (i === arrowPosition) {
            const arrowDiv = document.createElement('div');
            arrowDiv.className = 'arrow';
            bar.appendChild(arrowDiv);
        }
    }
}

async function bubbleSort() {
    //const startTime = performance.now();
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            arrowPosition = j; // Update arrow position
            renderBars(); // Render bars with arrow
            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
            }
        }
    }
    arrowPosition = -1; // Reset arrow position
    renderBars(); // Render bars without arrow
    //const endTime = performance.now();
    //const completionTimeInSeconds = (endTime - startTime) / 1000; // Convert to seconds
    //alert(`Bubble Sort completed in ${completionTimeInSeconds.toFixed(2)} seconds`);
}

async function selectionSort() {
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            arrowPosition = j; // Update arrow position
            renderBars(); // Render bars with arrow
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        await swap(i, minIndex);
    }
    arrowPosition = -1; // Reset arrow position
    renderBars(); // Render bars without arrow
}

async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
        let current = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > current) {
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = current;
        arrowPosition = i; // Update arrow position
        renderBars(); // Render bars with arrow
        await sleep(animationSpeed);
    }
    arrowPosition = -1; // Reset arrow position
    renderBars(); // Render bars without arrow
}

async function mergeSort() {
    
    array = await mergeSortRecursive(array);
    renderBars();
   
}

async function mergeSortRecursive(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const middle = Math.floor(arr.length / 2);
    const left = await mergeSortRecursive(arr.slice(0, middle));
    const right = await mergeSortRecursive(arr.slice(middle));

    return merge(left, right);
}

async function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

async function quickSort() {
    await quickSortRecursive(0, array.length - 1);
    renderBars();
}

async function quickSortRecursive(low, high) {
    if (low < high) {
        const pivotIndex = await partition(low, high);
        await quickSortRecursive(low, pivotIndex - 1);
        await quickSortRecursive(pivotIndex + 1, high);
    }
}

async function partition(low, high) {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (array[j] < pivot) {
            i++;
            await swap(i, j);
        }
    }

    await swap(i + 1, high);
    return i + 1;
}

async function shellSort() {
    const n = array.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            let temp = array[i];
            let j;
            for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
                array[j] = array[j - gap];
                arrowPosition = j; // Update arrow position
                renderBars(); // Render bars with arrow
                await sleep(animationSpeed);
            }
            array[j] = temp;
        }
    }
    arrowPosition = -1; // Reset arrow position
    renderBars(); // Render bars without arrow
}

async function heapSort() {
    const n = array.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }
    for (let i = n - 1; i > 0; i--) {
        await swap(0, i);
        arrowPosition = i; // Update arrow position
        renderBars(); // Render bars with arrow
        await heapify(i, 0);
    }
    arrowPosition = -1; // Reset arrow position
    renderBars(); // Render bars without arrow
}

async function heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && array[left] > array[largest]) {
        largest = left;
    }

    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== i) {
        await swap(i, largest);
        arrowPosition = largest; // Update arrow position
        renderBars(); // Render bars with arrow
        await heapify(n, largest);
    }
}

function updateSpeed() {
    animationSpeed = 100 - parseInt(speedSlider.value);
}

generateBtn.addEventListener('click', () => generateArray());
bubbleSortBtn.addEventListener('click', () => bubbleSort());
mergeSortBtn.addEventListener('click', () => mergeSort());
selectionSortBtn.addEventListener('click', () => selectionSort());
insertionSortBtn.addEventListener('click', () => insertionSort());
quickSortBtn.addEventListener('click', () => quickSort());
shellSortBtn.addEventListener('click', () => shellSort());
heapSortBtn.addEventListener('click', () => heapSort()); // Add this line
speedSlider.addEventListener('change', updateSpeed);

generateArray(); // Generate initial array

// Utility functions

async function swap(i, j) {
    await sleep(animationSpeed);
    [array[i], array[j]] = [array[j], array[i]];
    renderBars();
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
