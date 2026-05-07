import type { VarsMap } from './variables';

const MES_MAP: Record<string, number> = {
  Janeiro: 1,
  Fevereiro: 2,
  'Março': 3,
  Abril: 4,
  Maio: 5,
  Junho: 6,
  Julho: 7,
  Agosto: 8,
  Setembro: 9,
  Outubro: 10,
  Novembro: 11,
  Dezembro: 12,
};

function digitsOnly(s: string | number | undefined): string {
  return String(s ?? '').replace(/\D/g, '');
}

function digitalRoot(n: string | number | undefined): number {
  const raw = digitsOnly(n);
  let sum = 0;
  for (let i = 0; i < raw.length; i++) sum += Number(raw[i]);
  while (sum > 9) {
    let t = 0;
    const parts = String(sum).split('');
    for (let j = 0; j < parts.length; j++) t += Number(parts[j]);
    sum = t;
  }
  return sum;
}

function mesNumero(mes: string | number | undefined): number {
  const raw = String(mes ?? '');
  return MES_MAP[raw] || Number(raw) || 0;
}

export function runCodeBlock(blockId: string, vars: VarsMap, setVar: (n: string, v: string | number) => void) {
  const dia = vars['Dia'];
  const mes = vars['Mês'] ?? vars['Mes'];
  const ano = vars['Ano'];

  if (blockId === 'oemuz1ypeplvgc7ox6qg482m') {
    const raw = digitsOnly(dia);
    const digits = raw.split('');
    let sum = 0;
    for (const d of digits) sum += Number(d);
    const reduced = digitalRoot(sum);
    setVar('CalcTexto', `${digits.join('+')}=${sum} → ${reduced}`);
    setVar('NumeroDestino', reduced);
    return;
  }
  if (blockId === 'yonmarc7zmi9vv5t98buhfgk') {
    setVar('MesNumero', mesNumero(mes));
    return;
  }
  if (blockId === 'n7wnyc4dod2txho5op584vrf') {
    const d = digitalRoot(dia);
    const m = digitalRoot(mesNumero(mes));
    const y = digitalRoot(ano);
    setVar('DiaReducido', d);
    setVar('MesReducido', m);
    setVar('AnoReducido', y);
    setVar('SomaD_M_A', d + m + y);
    return;
  }
  if (blockId === 'usx2otjxbt32rygz1y1nfwkw') {
    const num = mesNumero(mes);
    const digits = String(num).split('');
    let sum = 0;
    for (const d of digits) sum += Number(d);
    const reduced = digitalRoot(sum);
    setVar('MesNumero', num);
    setVar('MesCalcTexto', `${digits.join('+')}=${sum} → ${reduced}`);
    setVar('MesReducido', reduced);
    return;
  }
  if (blockId === 'cp3ebr8tbx21j5zorhtm6t4g') {
    const raw = digitsOnly(ano);
    const digits = raw.split('');
    let sum = 0;
    for (const d of digits) sum += Number(d);
    setVar('AnoCalcTexto', `${digits.join('+')}=${sum}`);
    setVar('AnoSoma', sum);
    return;
  }
  if (blockId === 'f7tul304g3ey72prj0ilzui3') {
    const raw = digitsOnly(ano);
    let sum = 0;
    for (let i = 0; i < raw.length; i++) sum += Number(raw[i]);
    let reduced = sum;
    let texto = '';
    if (reduced > 9) {
      const parts = String(reduced).split('');
      let t = 0;
      for (const p of parts) t += Number(p);
      texto = `${parts.join('+')}=${t}`;
      reduced = t;
    }
    while (reduced > 9) {
      const parts = String(reduced).split('');
      let tt = 0;
      for (const p of parts) tt += Number(p);
      texto = `${parts.join('+')}=${tt}`;
      reduced = tt;
    }
    setVar('AnoReducaoTexto', texto);
    setVar('AnoReducido', reduced);
    return;
  }
  if (blockId === 'b4fpueg8mgr02s8ucyxi6j8x') {
    setVar('DiaReducido', digitalRoot(dia));
    return;
  }
  if (blockId === 'wmd569k58s1xw0dawtsh29ev') {
    setVar('MesReducido', digitalRoot(mesNumero(mes)));
    return;
  }
  if (blockId === 'rvdsp19291u0u1v4uncx89ow') {
    const d = digitalRoot(dia);
    const m = digitalRoot(mesNumero(mes));
    const y = digitalRoot(ano);
    const numeroAmor = digitalRoot(d + m + y);
    setVar('NumeroAmor', numeroAmor);
    return;
  }
}

export function calcularSigno(dia: number, mes: number): string {
  if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) return 'Áries';
  if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) return 'Touro';
  if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) return 'Gêmeos';
  if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) return 'Câncer';
  if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) return 'Leão';
  if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) return 'Virgem';
  if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) return 'Libra';
  if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) return 'Escorpião';
  if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) return 'Sagitário';
  if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) return 'Capricórnio';
  if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) return 'Aquário';
  return 'Peixes';
}
