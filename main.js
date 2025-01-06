let min = 0;
let max = 0;
let step = 0;

const initialValuesContainer = document.querySelector('.initial-values-container');
const container = document.querySelector('.container');
const filled = document.getElementById('filled');
const rangeContainer = document.getElementById('range-container');
const initialOkButton = document.getElementById('initial-ok-button');
const button = document.getElementById('ok-button');
const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const range1 = document.getElementById('range1');
const range2 = document.getElementById('range2');
const minInput = document.getElementById('min-input');
const maxInput = document.getElementById('max-input');
const stepInput = document.getElementById('step-input');

function initializeRangeValues() {
  min = +minInput.value;
  max = +maxInput.value;
  step = +stepInput.value;

  if (min > max) {
    alert('Min value cannot be greater than Max value.');
    return;
  }
  if (step > max - min) {
    alert('Step cannot be greater than the difference between Max and Min.');
    return;
  }
  if ((max - min) % step !== 0) {
    alert('Step must be a multiple of the difference between Max and Min.');
    return;
  }

  container.style.display = 'flex';
  rangeContainer.style.display = 'block';
  initialValuesContainer.style.display = 'none';

  range1.setAttribute('min', min);
  range1.setAttribute('max', max);
  range1.setAttribute('step', step);
  range2.setAttribute('min', min);
  range2.setAttribute('max', max);
  range2.setAttribute('step', step);

  const [randomNumber1, randomNumber2] = generateRandomNumbers(min, max);
  range1.value = Math.min(randomNumber1, randomNumber2);
  range2.value = Math.max(randomNumber1, randomNumber2);

  updateValues();
}

function handleInputChange(event, isRange1) {
  let newValue = +event.target.value.replace(/[^0-9]/g, '') || min;

  if (isRange1) {
    if (newValue > max) {
      newValue = max - step;
    }
    if (newValue >= +input2.value) {
      range2.value = newValue + step;
    }
    if (newValue < min) {
      newValue = min;
    }
  } else {
    if (newValue > max) {
      newValue = max;
    }
    if (newValue < min) {
      newValue = min + step;
    }
    if (newValue <= +input1.value) {
      range1.value = newValue - step;
    }
  }
  event.target.value = newValue;
  isRange1 ? (range1.value = newValue) : (range2.value = newValue);
  updateValues();
}

function updateValues() {
  let value1 = Math.min(range1.value, range2.value);
  let value2 = Math.max(range1.value, range2.value);

  if (value1 === max) {
    value1 = max - step;
    range1.value = value1;
  }
  if (value2 === min) {
    value2 = min + step;
    range2.value = value2;
  }

  const rangeWidth = max - min;
  const value1Percentage = Math.round(((value1 - min) / rangeWidth) * 100);
  const value2Percentage = Math.round(((value2 - min) / rangeWidth) * 100);

  filled.style.left = `${value1Percentage}%`;
  filled.style.width = `${value2Percentage - value1Percentage}%`;

  input1.value = value1;
  input2.value = value2;
}

function handleClickOnRangeContainer(event) {
  const container = event.currentTarget;
  const containerRect = container.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const clickPosition = event.clientX - containerRect.left;

  const sliderWidth = 25 / 2;
  let newValue = (clickPosition / containerWidth) * (max - min) + min;

  const distanceToRange1 = Math.abs(range1.value - newValue);
  const distanceToRange2 = Math.abs(range2.value - newValue);

  if (distanceToRange1 < distanceToRange2) {
    if (newValue < range1.value) {
      const adjustedClickPosition = clickPosition - sliderWidth;
      newValue = (adjustedClickPosition / containerWidth) * (max - min) + min;
    }
    range1.value = newValue;
  } else {
    if (newValue > range2.value) {
      const adjustedClickPosition = clickPosition + sliderWidth;
      newValue = (adjustedClickPosition / containerWidth) * (max - min) + min;
    }
    range2.value = newValue;
  }
  updateValues();
}

function handleClickButton() {
  alert(`Minimum value - ${input1.value}, maximum value - ${input2.value}`);
}

function generateRandomNumbers(min, max) {
  const random1 = Math.floor(Math.random() * (max - min + 1)) + min;
  const random2 = Math.floor(Math.random() * (max - min + 1)) + min;

  return [random1, random2];
}

initialOkButton.addEventListener('click', initializeRangeValues);

input1.addEventListener('input', (event) => handleInputChange(event, true));
input2.addEventListener('input', (event) => handleInputChange(event, false));

range1.addEventListener('input', updateValues);
range2.addEventListener('input', updateValues);

button.addEventListener('click', handleClickButton);

let isDragging = false;
range1.addEventListener('mousedown', () => {
  isDragging = true;
});
range1.addEventListener('mouseup', () => {
  setTimeout(() => {
    isDragging = false;
  }, 500);
});

range2.addEventListener('mousedown', () => {
  isDragging = true;
});
range2.addEventListener('mouseup', () => {
  setTimeout(() => {
    isDragging = false;
  }, 500);
});

rangeContainer.addEventListener('mousedown', (event) => {
  if (!isDragging) handleClickOnRangeContainer(event);
});
