/* IMP olcegi. Sinirlar bridge-data.js icindeki IMP_SCALE'den gelir (kaynak: Excel). */

function calculateIMP(scoreDifference) {
  const diff = Math.abs(Number(scoreDifference) || 0);
  const scale = (typeof IMP_SCALE !== 'undefined')
    ? IMP_SCALE
    : require('./bridge-data.js').IMP_SCALE;

  for (const band of scale) {
    if (band.to === null || band.to === undefined) return band.imp;
    if (diff <= band.to) return band.imp;
  }
  return scale[scale.length - 1].imp;
}

if (typeof module !== 'undefined') { module.exports = { calculateIMP }; }
