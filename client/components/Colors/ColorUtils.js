import * as Colors from './Colors';

const shades = ['50','100','200','300','400','500','600','700','800','900','a100','a200','a400','a700'];
const testHexColor = new RegExp(/#([a-f0-9]{3}){1,2}\b/i);
const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
const longhandRegex = /^#?([a-f\d][a-f\d])([a-f\d][a-f\d])([a-f\d][a-f\d])$/i;

// Clamps a number into a given range.
const limit = (value, min, max) => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};

/* eslint-disable no-bitwise */
const hashString = (str) => {
  return Math.abs(
    String(str).split('')
      .reduce((hash, char) => (hash << 5 - hash) + char.charCodeAt(0), 0));
};

const stringToHash = (str) => {
  let colour = '#';
  const hash = hashString(str);
  for (let i = 0; i < 3; i++) {
    const value = hash >> i * 8 & 0xFF;
    colour += `00${value.toString(16)}`.substr(-2);
  }
  return colour;
};
/* eslint-enable no-bitwise */

const hexToInt = (hex) => {
  return parseInt(hex, 16);
};

// ========================================
// Lookup color and shade in Colours ...
// ========================================
const lookupColor = (name, shade = '500') => {
  const lower = name.replace(/[^a-z]/gi, '').toLowerCase();
  if ( shades.indexOf(shade) === -1 ) {
    shade = '500';
  }
  const color = `${name}${shade}`;
  const which = Colors[color];
  if (!which) {
    throw new Error(`Colors does not contain an entry ${color}]`);
  }
  return which;
};

// ========================================
// Various color type convertion functions
// ========================================
const hex6SplitRgb = hex6 => hex6.match(/.{2}/g).map(x => hexToInt(x));

const rgbArrayToColor = rgb => `#${rgb.map(x => {
  const hex = x.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}).join('')}`;

const hex6ToColor = (hex6) => {
  return `#${hex6}`;
};

const hexToColor = (hex) => {
  return `#${hex.replace(shorthandRegex, (m, r, g, b) => `${r}${r}${g}${g}${b}${b}`)}`;
};

const colorToHex6 = (color) => {
  if (typeof color !== 'string') {
    throw new Error('color should be a string');
  }
  let hex = color;
  if (color.length === 7 || color.length === 4) {
    hex = color.substr(1);
  }
  return hex.replace(shorthandRegex, (m, r, g, b) => `${r}${r}${g}${g}${b}${b}`);
};

const ensureHex6 = (color) => {
  if (typeof color !== 'string') {
    throw new Error('color should be a string');
  }
  let hex;
  if (testHexColor.test(color)) {
    hex = color;
  } else {
    hex = lookupColor(color, args);
  }

  const hex6 = colorToHex6(hex);
  return hex6;
};

const convertColorToRgb = (color) => {
  const hex6 = colorToHex6(color);
  const rgb = hex6SplitRgb(hex6);
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
};

const rgbToHsl = (rgb) => {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h;
  let s;
  const l = (max + min) / 2;

  if (max === min) {
    // achromatic
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h, s, l];
};

const hue = (p, q, t) => {
  if (t < 0) {
    t += 1;
  }
  if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
};

const hslToRgb = (hsl) => {
  const h = hsl[0];
  const s = hsl[1];
  const l = hsl[2];

  let r, g, b;
  if (s === 0) {
    // achromatic
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue(p, q, h + 1 / 3);
    g = hue(p, q, h);
    b = hue(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

const getLuminance = (color) => {
  const hex6 = colorToHex6(color);
  const rgb = hex6SplitRgb(hex6);

  const luminance = rgb.map((val) => {
    val /= 255; // normalized
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return Number((0.2126 * luminance[0] + 0.7152 * luminance[1] + 0.0722 * luminance[2]).toFixed(3)); // Truncate at 3 digits
};

// const interoplateColour = (hue, saturation, value, min, range) => {
export const interoplateColour = (color, value, min, range) => {
  const heat = value - min;
  const lum = 97 - Math.floor(heat * 40 / range);

  // update the luminosity value in hsl
  const hex6 = colorToHex6(color);
  const rgb = hex6SplitRgb(hex6);
  const hsl = rgbToHsl(rgb);
  hsl[2] = lum;

  const interoplated  = hslToRgb(hsl)
  return rgbArrayToColor(interoplated);
}

// ========================================
// Various UI color utility functions
// ========================================
export const getByIndex = (index) => {
  const len = Object.keys(Colors).length;
  if (index < 0 || index >= len) {
    return getColor('white');
  }
  const key = Object.keys(Colors)[index];
  return Colors[key];
}

export const getColor = (color, ...args) => {
  if (typeof color !== 'string') {
    throw new Error('color should be a string');
  }
  // if there is a '#' followed by either {3,6} hex
  let hex;
  if (testHexColor.test(color)) {
    hex = hex6ToColor(colorToHex6(color));
  } else {
    hex = lookupColor(color, args);
  }
  return hex;
}

export const invert = (color, ...args) => {
  if (typeof color !== 'string') {
    throw new Error('color should be a string');
  }
  let hex;
  if (testHexColor.test(color)) {
    hex = color;
  } else {
    hex = lookupColor(color, args);
  }
  const value = hexToInt(colorToHex6(hex));
  const mask = 0xFFFFFF;
  const complement = mask ^ value;
  const str = `000000${complement.toString(16)}`.slice(-6);
  return hex6ToColor(str);
}

export const foreOnBackground = (color, ...args) => {
  if (typeof color !== 'string') {
    throw new Error('color should be a string');
  }

  let hex;
  if (testHexColor.test(color)) {
    hex = color;
  } else {
    hex = lookupColor(color, args);
  }

  const hex6 = colorToHex6(hex);
  const rgb = hex6SplitRgb(hex6);

  // Simple model
  // let isDark = ((rgb[0] + rgb[1] + rgb[2]) < 384);
  // return isDark ? materialColors['white'] : materialColors['black'];

  // Build the YIQ function for intensity
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  return brightness >= 128 ? getColor('black') : getColor('white');
}

export const fadeSlightly = (color, ...args) => {
  if (typeof color !== 'string') {
    throw new Error('color should be a string');
  }
  let hex;
  if (testHexColor.test(color)) {
    hex = color;
  } else {
    hex = lookupColor(color, args);
  }
  const hex6 = colorToHex6(hex);
  const rgb = hex6SplitRgb(hex6);
  const hsl = rgbToHsl(rgb);

  // Keep the Hue, reduce the saturation by 15% and increase luminance by 20%
  hsl[1] -= 0.15;
  if (hsl[1] < 0) {
    hsl[1] = 0;
  }
  hsl[2] += 0.20;
  if (hsl[2] > 1) {
    hsl[2] = 1;
  }
  const faded = hslToRgb(hsl);
  return rgbArrayToColor(faded);
}

export const fade = (color, coefficient, ...args) => {
  if (typeof color !== 'string') {
    throw new Error('color should be a string');
  }
  const opacity = limit(coefficient, 0, 1);
  let hex;
  if (testHexColor.test(color)) {
    hex = color;
  } else {
    hex = lookupColor(color, args);
  }
  const hex6 = colorToHex6(hex);
  const rgb = hex6SplitRgb(hex6);
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
}

// // color => #rrggbb, hex6 => rrggbb, hex3 => rgb
// export const fade = (color, value) => {
//   if (typeof color !== 'string') {
//     throw new Error('color should be a string');
//   }
//   const hex6 = colorToHex6(hex);
//   const rgb = hex6SplitRgb(hex6);
//   const opacity = limit(value, 0, 1);
//   return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacity})`;
// }

export const getContrastRatio = (foreground, background) => {
  const lumA = getLuminance(foreground);
  const lumB = getLuminance(background);
  const contrastRatio = (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
  return Number(contrastRatio.toFixed(2));
}

export const darken = (color, coefficient) => {
  if (typeof color !== 'string') {
    throw new Error('color should be a string');
  }
  coefficient = limit(coefficient, 0, 1);

  let hex;
  if (testHexColor.test(color)) {
    hex = color;
  } else {
    hex = lookupColor(color, args);
  }

  const hex6 = colorToHex6(hex);
  const rgb = hex6SplitRgb(hex6);
  for (let i = 0; i < 3; i++) {
    const newValue = Math.round(rgb[i] * (1 - coefficient),0);
    rgb[i] = newValue;
  }
  return rgbArrayToColor(rgb);
}

export const lighten = (color, coefficient)  => {
  if (typeof color !== 'string') {
    throw new Error('color should be a string');
  }
  coefficient = limit(coefficient, 0, 1);

  let hex;
  if (testHexColor.test(color)) {
    hex = color;
  } else {
    hex = lookupColor(color, args);
  }

  const hex6 = colorToHex6(hex);
  const rgb = hex6SplitRgb(hex6);
  for (let i = 0; i < 3; i++) {
    const delta = Math.round((255 - rgb[i]) * coefficient, 0);
    rgb[i] += delta;
  }
  return rgbArrayToColor(rgb);
}

export const emphasize = (color, coefficient = 0.3333) => {
  return getLuminance(color) > 0.5 ? darken(color, coefficient) : lighten(color, coefficient);
}

export const getRandomColorFromString = (string) => {
  const hash = hashString(string);
  const colors = Object.keys(Colors).slice(0, -2);   // black500, white500,
  return Colors[colors[hash % colors.length]];
}
