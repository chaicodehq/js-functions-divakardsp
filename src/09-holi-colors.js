/**
 * 🎨 Holi Color Mixer - Pure Functions
 *
 * Holi ka festival hai! Rang mix karne hain. Lekin PURE FUNCTIONS use
 * karne hain — matlab:
 *   1. Input ko KABHI modify mat karo (no mutation)
 *   2. Same input pe HAMESHA same output aaye
 *   3. Koi side effects nahi (no console.log, no external state changes)
 *
 * Har color object: { name: string, r: number, g: number, b: number }
 *   where r, g, b are 0-255 (RGB values)
 *
 * Functions:
 *
 *   1. mixColors(color1, color2)
 *      - Mix two colors by averaging their RGB values
 *      - New name: `${color1.name}-${color2.name}`
 *      - Round RGB values to integers
 *      - MUST NOT modify color1 or color2
 *      - Agar either color null/invalid, return null
 *
 *   2. adjustBrightness(color, factor)
 *      - Multiply each RGB by factor, clamp to 0-255 range
 *      - Round to integers using Math.round
 *      - Name stays same
 *      - MUST NOT modify original color
 *      - Agar color null or factor not number, return null
 *
 *   3. addToPalette(palette, color)
 *      - Return NEW array with color added at end
 *      - MUST NOT modify original palette array
 *      - Agar palette not array, return [color]
 *      - Agar color null/invalid, return copy of palette
 *
 *   4. removeFromPalette(palette, colorName)
 *      - Return NEW array without the color with that name
 *      - MUST NOT modify original palette
 *      - Agar palette not array, return []
 *
 *   5. mergePalettes(palette1, palette2)
 *      - Merge two palettes into NEW array
 *      - No duplicate names (keep first occurrence)
 *      - MUST NOT modify either original palette
 *      - Agar either not array, treat as empty array
 *
 * Hint: Use spread operator [...arr], Object spread {...obj} to create
 *   copies. NEVER use push, splice, or direct property assignment on inputs.
 *
 * @example
 *   const red = { name: "red", r: 255, g: 0, b: 0 };
 *   const blue = { name: "blue", r: 0, g: 0, b: 255 };
 *   mixColors(red, blue)
 *   // => { name: "red-blue", r: 128, g: 0, b: 128 }
 *   // red and blue objects are UNCHANGED
 */
export function mixColors(color1, color2) {
    if (color1 === null || color2 === null) return null;
    if (color1 === undefined || color2 === undefined) return null;

    const colors = [color1.r, color1.g, color1.b, color2.r, color2.g, color2.b];
    const isValid = colors.every((color) => {
      return (typeof color === "number" && 0 <= color && color <=255);
    })

    if(! isValid) return null;

    const newName = `${color1.name}-${color2.name}`;
    const newR = Math.round((color1.r+color2.r)/2);
    const newG = Math.round((color1.g+color2.g)/2);
    const newB = Math.round((color1.b+color2.b)/2);

    return {name: newName, r:newR,g:newG,b:newB}

}

export function adjustBrightness(color, factor) {
    if( color === null || typeof factor !== "number") return null;

    const multipliedR = Math.round(color.r*factor)>255? 255:Math.round(color.r*factor) ;
    const multipliedG = Math.round(color.g*factor)>255? 255: Math.round(color.g*factor);
    const multipliedB = Math.round(color.b*factor)>255? 255: Math.round(color.g*factor);

    return {name: color.name, r: multipliedR, g:multipliedG,b:multipliedB};
  
  }

export function addToPalette(palette, color) {
   if(! Array.isArray(palette)) return [color];
   if(color === null || color === undefined) return [...palette];

   const colors = [color.r, color.g, color.b];
    const isValid = colors.every((color) => {
      return (typeof color === "number" && 0 <= color && color <=255);
    })

    if(! isValid) return [...palette];

   const copyPallete = [...palette];
   copyPallete.push(color);
   return copyPallete

}

export function removeFromPalette(palette, colorName) {
    if(! Array.isArray(palette)) return [];

    const copyPallete = [...palette];
    return copyPallete.filter((color) => color.name !== colorName)
}

export function mergePalettes(palette1, palette2) {
  if(! Array.isArray(palette1)) palette1 = [];
  if(! Array.isArray(palette2)) palette2 = [];

  const newArr = [...palette1, ...palette2];
  const seen = new Set();
  const result = [];

  for(let color of newArr){
    if(! seen.has(color.name)){
      seen.add(color.name);
      result.push(color);
    }
  }

  return result;

}
