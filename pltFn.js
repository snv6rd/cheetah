const initVar = () => {
  console.log('initVar');

  chn = document.getElementById('chn').value;  
  console.log('chn', chn);
  tfrm = document.getElementById('tfrm').value;  
  console.log('tfrm', tfrm);
  if (chn=='hyp' && tfrm=='1d') {
    coins = hyprCoinsD;
    res = 1;
  } else if (chn=='hyp' && tfrm=='1h') {
    coins = hyprCoins;
    res = 1;
  } else if (chn=='hyp' && tfrm=='4h') {
    coins = hyprCoins;
    res = 4;
  } else if (chn=='solai' && tfrm=='1d') {
      coins = solaiCoinsD;
      res = 1;
      console.log('vollen vollen vollen vollen vollen vollen vollen vollen vollen ');
      const id = 'bankercoin-2';
      console.log('chrt len', coins[id].chrt.length, 'vol len', coins[id].vol.length);
  } else if (chn=='solai' && tfrm=='1h') {
      coins = solaiCoins;
      res = 1;
  } else if (chn=='solai' && tfrm=='4h') {
      coins = solaiCoins;
      res = 4;
  } else if (chn=='basai' && tfrm=='1d') {
      coins = basaiCoinsD;
      res = 1;
  } else if (chn=='basai' && tfrm=='1h') {
      coins = basaiCoins;
      res = 1;
  } else if (chn=='basai' && tfrm=='4h') {
      coins = basaiCoins;
      res = 4;
  } else if (chn=='solmi' && tfrm=='1d') {
      coins = solmiCoinsD;
      res = 1;
  } else if (chn=='solmi' && tfrm=='1h') {
      coins = solmiCoins;
      res = 1;
  } else if (chn=='solmi' && tfrm=='4h') {
      coins = solmiCoins;
      res = 4;
  /* } else if (chn=='dxsc') {
      coins = dxscCoins;
      res = 1; */   
  } else if (chn=='dxsc' && tfrm=='1d') {   // **fix
    coins = dxscCoins;
    res = 12;
  } else if (chn=='dxsc' && tfrm=='1h') {
    coins = dxscCoins;
    res = 1;
  } else if (chn=='dxsc' && tfrm=='4h') {
    coins = dxscCoins;
    res = 3;   
  } else {
    console.log('chn err', chn, tfrm);
    return;
  } 
  
  idRef = 'bitcoin';   
  if (chn=='dxsc') {
    //idRef = 'jup-sol-jup..zns';
    idRef = 'toshi-bas-0xa..531';
    coins[idRef] = dxscCoins[idRef];
  } else if (chn!='hyp') {
    if (tfrm=='1d') {
      coins[idRef] = hyprCoinsD[idRef];
    } else {
      coins[idRef] = hyprCoins[idRef];
    }
  }

  coinId = Object.keys(coins);
  coinId = coinId.filter(v => v.slice(0, 7)!='lai-sol' && v.slice(0, 7)!='arc-bas');
  console.log('coinId len', coinId.length, coinId.slice(0,10));

  /* shrtId = shrtLst.slice();
  console.log('shrtId len', shrtId.length, shrtId.slice(0, 5));
  for (let i=0; i<shrtId.length; i++) {
    if (!coinId.includes(shrtId[i])) {
      console.log('sssss', i, shrtId[i]);
    }
  } */
  //coinId = coinId.filter(v => shrtId.includes(v));   //HYPR
  //coinId = coinId.filter((v, i) => i<25); 
  //coindId = coinId.slice(0, 8);
  //console.log('coinId len', coinId.length, coinId.slice(0,10));

  nCoin = coinId.length; 
  //console.log('nCoin', nCoin);

  maxWidth = 3*width;
  maxHeight = nCoinPg*2*height;

  coinId = coinId.slice(0, nCoin);   // rm
  coinNum = {};
  coinId.forEach((v, i) => coinNum[v] = i);
  //console.log('coinNum', coinNum);

  coinSym = {}, coinSymId = {};
  //coinId.forEach((v, i) => console.log('coinId', i, v));
  coinId.forEach(v => coinSym[v] = coins[v].sym);
  if (chn=='dxsc') {
    coinId.forEach(v => { const i = v.indexOf('-'); coinSym[v] += v.slice(i, i+4); coinSymId[v] = coinSym[v]});
    //const id1 = coinId.find(v => v.includes('render'));
    //const i1 = id1.indexOf('-');
    //console.log('symid symid symid symid symid ', id1, '1', coins[id1].sym, '2', coinSym[id1], '3', coinSymId[id1]);
    //console.log('i1', i1, id1.slice(i1, i1+4));
  } else {
    coinId.forEach(v => { coinSymId[v] = coinSym[v]+' - '+v.slice(0, 10); });
  }

  //console.log('coinSym', coinSym);

  coinPrc = {};
  ema = [];
  emax = [], emin = [], emid = [], emaxl = [], eminl = [], emaxs = [], emins = [];
  hi = [], lo = [], emh = [], eml = [], anh = [], anl = [];
  nxtRet = {}, nxtRet1 = {};
  compPrc(res);

  //console.log('idref chk', idRef);
  const l = coinPrc[idRef].prc.length;
  //console.log('l', l);

  dema = [];
  dDema = [];
  compDema();   
  sclDema(2); //2);
  difDema();
  sclDDema(2);
  demax = [], demin = [];
  compDemax();   
  //sclDemax(0); 
  compEmh();

  i2 = coinPrc[idRef].prc.length;
  i1 = Math.max(i2-120, 0);

  emaOn = false;
  mhlOn = false;
  msrOn = false;
  trnOn = false;

  coinRet = {};
  compRet();
  coinScor = {}, coinScorRev = {}, coinScorAll = {}, coinScorLst = {}, coinScor0 = {}, coinScorAll0 = {};
  coinSlp = {};
  compScor();
  compSpr();

}


const mkPltDiv = (id, cls) => {
  const pltDiv = document.createElement('div');
  pltDiv.id = id;
  pltDiv.className = cls;
  pltDiv.style.display = 'flex'; 
  pltDiv.style['justify-content'] = 'center';
  pltDiv.style['align-items'] = 'center';
  //pltDiv.style['width'] = width;
  //pltDiv.style['height'] = height;
  return pltDiv;
}


const setCur = () => {
  console.log('setCur');
  //console.log(console.dir(plotsContainer));
  const pltId = topPlt();
  //console.log('pltId', pltId);
  //window.scrollTo(0, 0);
}


const dup = () => {
  console.log('dup');
  const url = window.location.href;
  window.open(url, '_blank');
}


const topPlt = () => {   // !work   use ncoinpg
  console.log('topPlt');
  const qlots = document.querySelectorAll('.plot');
  //console.log('qlots', qlots);
  let topPlot = null; 
  let topOffset = Infinity;
  qlots.forEach(plot => { 
    if (plot.id!='') {
      const rect = plot.getBoundingClientRect(); 
      console.log('rect top', rect.top, 'ofst', topOffset);
      if (topPlot) {
        console.log('top id', topPlot);
      }
      if (rect.top < topOffset) { 
        topOffset = rect.top; topPlot = plot; 
      }
    } 
  });
  return topPlot ? topPlot.id : null;
}


const displayPlots = (iScrl) => {
//function displayPlots() {
  console.log('displayPlots');
  let trace, data, layout, pltId;

  if (iCoin0<0) {
    console.log('0');
    iCoin0 = 0;
  }
  if (iCoin0+nCoinPg>nCoin) {
    console.log('1', iCoin0, nCoinPg, nCoin, iCoin0+nCoinPg, nCoin);
    iCoin0 = nCoin-nCoinPg;
  }
  console.log('iCoin0', iCoin0);

  const coinIdSrt = Object.entries(coinNum).sort((a, b) => a[1]-b[1]).map(v => v[0]);
  for (let iCoin=iCoin0; iCoin<iCoin0+nCoinPg; iCoin++) {
    const iCoinSrt = coinId.indexOf(coinIdSrt[iCoin]);
    for (let iRow=0; iRow<2; iRow++) {
      for (let iCol=0; iCol<3; iCol++) {
        pltId = `i${iCoinSrt}r${iRow}${iCol}`;
        pltData = plots.find(v => v.id==pltId);
        if (pltData) {
          const {id, data, layout} = pltData;
          //plots.push({ id: pltId, data: data, layout: layout, coinId: id, srtId: srtId });
          const id1 = pltData.coinId;
          //if (id1.includes('render') && iRow==0 && iCol==0) {
          //  console.log('disp disp disp disp disp ', id1, 'layout', pltData.layout);
          //}
          const pltId1 = `i${iCoin-iCoin0}r${iRow}${iCol}`;
          Plotly.react(pltId1, data, layout);
        }
      }
    }
  }

  if (iScrl) {
    window.scrollTo(0, 0);
  }

  //window.addEventListener('DOMContentLoaded', (event) => { window.scrollTo(0, 0); });
}


const pltFig = () => {   // add pltdat
  console.log('pltFig');
  plots = [];
  pltTrc = {};
  pltDat = {};

  while (plotsContainer.firstChild) {
    plotsContainer.removeChild(plotsContainer.firstChild);
  }

  //console.log('ppp maxWidth', maxWidth);
  plotsContainer.style.width = `${maxWidth}px`;
  plotsContainer.style.height = `${maxHeight+100}px`;

  let coinDiv = {};    
  //let pltDiv;
  let divId, pltId;
  let trcCol;

  for (let iCoin=0; iCoin<nCoinPg; iCoin++) {
    for (let iRow=0; iRow<2; iRow++) {
      divId = `i${iCoin}r${iRow}`;
      coinDiv[divId] = {};
      coinDiv[divId].div = mkPltDiv(divId, 'row');
      plotsContainer.appendChild(coinDiv[divId].div);
      coinDiv[divId].arr = [];
      for (let iCol=0; iCol<3; iCol++) {
        pltId = `i${iCoin}r${iRow}${iCol}`;
        coinDiv[divId].arr[iCol] = mkPltDiv(pltId, 'plot');
        coinDiv[divId].div.appendChild(coinDiv[divId].arr[iCol]);
      }
    }
  }

  for (let iCoin=0; iCoin<nCoin; iCoin++) {   
  //for (let id of coinId) {
    const id = coinId[iCoin];
    //let iCoin = coinNum[id];
    //console.log('zzzpltpltplt id', id, 'iCoin', iCoin, nCoin, 'coinSym', coinSym[id])
    const dat = coinPrc[id].dat.map((val) => fmtTs(val, 2));
    //console.log('id', id, 'dat', dat[0], dat[1], dat[2]);
    let ymin, ymax;
    let trace, data, layout, tracn, ytit, trace0;
    for (let iRow=0; iRow<2; iRow++) {
      for (let iCol=0; iCol<3; iCol++) {
        // if (iRow==0 && iCol==0) {
          /* pltId = `i${iCoin}r${iRow}${iCol}`;
          [ymin, ymax] = yRng(id, iRow, iCol);
          const x = Array(10).fill(10).map(v => Math.random());
          const z = x.map(v => v**2);
          trace = { x: x, y: z, mode: 'lines', type: 'scatter', line: { color: 'blue', width: 1 }, name: pltId };
          data = [trace];
          layout = { title: { text: pltId, y: 0.9, pad: { t: 20 } }, width: 400, height: 260 };
          Plotly.newPlot(pltId, data, layout); */ 
        //} 
        pltId = `i${iCoin}r${iRow}${iCol}`;
        /* console.log('293 293 293 293 293', 'pltId', pltId);
        if (pltId=='i6r01') {
          console.log('id', id, 'dema', dema[1][id], 'dDema', dDema[1][id]);
        } */
        [ymin, ymax] = yRng(id, iRow, iCol);
        if (iRow==0 && iCol==0) {
          trace = { x: dat, y: coinPrc[id].prc, mode: 'lines', type: 'scatter', line: { color: colorp, width: 1 }, name: 'prc' };
          trach = { x: dat, y: emh[iMhl][id], mode: 'lines', type: 'scatter', line: { color: 'lightgray', width: 1 }, name: 'emh2' };
          tracl = { x: dat, y: eml[iMhl][id], mode: 'lines', type: 'scatter', line: { color: 'lightgray', width: 1 }, name: 'eml2' };
          trach1 = { x: dat, y: emax[iMhl][id], mode: 'lines', type: 'scatter', line: { color: 'brown', width: 1 }, name: 'emax2' };
          tracl1 = { x: dat, y: emin[iMhl][id], mode: 'lines', type: 'scatter', line: { color: 'goldenrod', width: 1 }, name: 'emin2' };
          //data = [trace, trach, tracl, trach1, tracl1];
          data = [trace];
          /* if (id.includes('arc')) { console.log('11111111 arc 11111111 arc 11111111 arc 11111111 arc 11111111 arc ', id.slice(0, 8), coinRet[id]) } */
          layout = { title: { text: coinSym[id]+' r='+coinRet[id].toString().slice(0, 5)+' s='+coinScor[id]+','+coinScor0[id]+'  '+coinScorLst[id]+'  f='+coinSlp[id], y: 0.9, pad: { t: 20 } }, width: width, height: height,
            //xaxis: { title: 'dat', tickformat: '%m-%d-%y %H:%M', tickangle: -45, nticks: 6 }, yaxis: { title: 'prc', autorange: true }
            xaxis: { title: 'dat', range: [dat[i1], dat[i2-1]], tickformat: '%m-%d %H', hoverformat: '%m-%d-%y %H:%M', tickfont: { size: 10 }, tickangle: -45, nticks: 6 }, 
            yaxis: { title: 'prc', range: [ymin, ymax] },   // autorange: true },
            showlegend: false,   //legend: { orientation: 'h', yanchor: 'top',}
            //xaxis2: { overlaying: 'x', side: 'top', tickformat: '%m-%d' }
          }; 
          //console.log('zzzlayout', layout.title);
          //Plotly.newPlot(pltId, data, layout);
          pltTrc[pltId] = { prc: 0 };
          pltDat[pltId] = { prc: data };
          /* if (id.includes('render')) {
            const prc1 = coinPrc[id].prc;
            console.log('yrng yrng yrng yrng yrng ', id, 'len', prc1.length, 'i1', i1, 'i2', i2);
            console.log('dat i1', dat[i1], 'i2', dat[i2], 'prc i1', prc1[i1], 'i2', prc1[i2]);
            console.log('min', math.min(prc1.slice(i1, i2)), 'max', math.max(prc1.slice(i1, i2)));
            console.log('ymin', ymin, 'ymax', ymax);
          } */
        } else if (iRow==0 && iCol==1) {
          trcCol = color[0];
          trace = { x: dat, y: dema[1][id], mode: 'lines', type: 'scatter', line: { color: trcCol, width: 1.5 }, name: 'dema3' };
          tracn = { x: dat, y: dDema[1][id], mode: 'lines', type: 'scatter', line: { color: 'lightgray', width: 1.5 }, name: 'dDema3' };
          //tracm = { x: dat, y: emaxs[1][id], mode: 'lines', type: 'scatter', line: { color: 'darkgreen', width: 1 }, name: 'emax3' };
          //tracm1 = { x: dat, y: emins[1][id], mode: 'lines', type: 'scatter', line: { color: 'darkred', width: 1 }, name: 'emin3' };
          //trach = { x: dat, y: anh[2][id], mode: 'lines', type: 'scatter', line: { color: 'brown', width: 1.5 }, name: 'anh2' };
          //tracl = { x: dat, y: anl[2][id], mode: 'lines', type: 'scatter', line: { color: 'goldenrod', width: 1.5 }, name: 'anl2' };
          //trace = { x: dat, y: ema[0][id], mode: 'lines', type: 'scatter', line: { color: trcCol, width: 1 }, name: 'ema1' };
          //tracn = { x: dat, y: emax[3][id], mode: 'lines', type: 'scatter', line: { color: 'brown', width: 1.5 }, name: 'emax3' };
          //tracm = { x: dat, y: emin[3][id], mode: 'lines', type: 'scatter', line: { color: 'goldenrod', width: 1.5 }, name: 'emin3' };
          //tracn1 = { x: dat, y: emax[0][id], mode: 'lines', type: 'scatter', line: { color: 'brown', width: 1.5 }, name: 'emax1' };
          //tracm1 = { x: dat, y: emin[0][id], mode: 'lines', type: 'scatter', line: { color: 'goldenrod', width: 1.5 }, name: 'emin1' };
          data = [trace, tracn];
          ytit = 'dema3';   //+(i==0 ? 'p' : emaPer[i-1]);
          layout = { title: { text: coinSymId[id]+'   spr='+coinSpr[id].toString().slice(0, 5), y: 0.9, pad: { t: 20 } }, width: width, height: height,
            xaxis: { title: 'dat', range: [dat[i1], dat[i2-1]], tickformat: '%m-%d %H', hoverformat: '%m-%d-%y %H:%M', tickfont: { size: 10 }, tickangle: -45, nticks: 6 }, 
            yaxis: { title: ytit, range: [ymin, ymax] },   // autorange: true },
            showlegend: false, 
          }; 
          //Plotly.newPlot(pltId, data, layout);
        } else if (iRow==0 && iCol==2) {
          trcCol = color[1];
          trace = { x: dat, y: dema[2][id], mode: 'lines', type: 'scatter', line: { color: trcCol, width: 1.5 }, name: 'dema5' };
          tracn = { x: dat, y: dDema[2][id], mode: 'lines', type: 'scatter', line: { color: 'lightgray', width: 1.5 }, name: 'dDema5' }; 
          //trach = { x: dat, y: anh[3][id], mode: 'lines', type: 'scatter', line: { color: 'brown', width: 1.5 }, name: 'anh3' };
          //tracl = { x: dat, y: anl[3][id], mode: 'lines', type: 'scatter', line: { color: 'goldenrod', width: 1.5 }, name: 'anl3' };
          data = [trace, tracn];
          ytit = 'dema5';   //+(i==0 ? 'p' : emaPer[i-1]);
          layout = { title: { text: coinSym[id], y: 0.9, pad: { t: 20 } }, width: width, height: height,
            xaxis: { title: 'dat', range: [dat[i1], dat[i2-1]], tickformat: '%m-%d %H', hoverformat: '%m-%d-%y %H:%M', tickfont: { size: 10 }, tickangle: -45, nticks: 6 }, 
            yaxis: { title: ytit, range: [ymin, ymax] },    // autorange: true },
            showlegend: false, 
          }; 
          //Plotly.newPlot(pltId, data, layout);
        } else if (iRow==1 && iCol==-1) {
          trace = [];
          /* for (let j=1; j<dema.length; j++) {   //nxtret
            trcCol = color[j-1];
            trace[j-1] = { x: dat, y: dema[j][id], mode: 'lines', type: 'scatter', line: { color: trcCol, width: 1 }, name: 'dema'+j };
          } */
          trace[0] = { x: dat, y: nxtRet[id], mode: 'lines', type: 'scatter', line: { color: colorp, width: 1 }, name: 'nxtRet' };
          trace[1] = { x: dat, y: nxtRet1[id], mode: 'lines', type: 'scatter', line: { color: color[1], width: 1 }, name: 'nxtRet1' };
          data = trace;
          layout = { title: { text: coinSym[id], y: 0.9, pad: { t: 20 } }, width: width, height: height,
            xaxis: { title: 'dat', range: [dat[i1], dat[i2-1]], tickformat: '%m-%d %H', hoverformat: '%m-%d-%y %H:%M', tickfont: { size: 10 }, tickangle: -45, nticks: 6 }, 
            //yaxis: { title: 'dema', range: [ymin, ymax] },   // autorange: true },   //nxtret
            yaxis: { title: 'nxtRet', range: [-2, 2] },
            showlegend: false,   //legend: { orientation: 'h', yanchor: 'top',}
            //xaxis2: { overlaying: 'x', side: 'top', tickformat: '%m-%d' }
          }; 
          //Plotly.newPlot(pltId, data, layout);
          //if (id=='aave') {
          //  console.log('demas trace', trace, 'ymin', ymin, 'ymax', ymax);
          //}
        } else if (iRow==1 && iCol==1) {
          trcCol = color[2];
          trace = { x: dat, y: dema[3][id], mode: 'lines', type: 'scatter', line: { color: trcCol, width: 2.0 }, name: 'dema11' };
          tracn = { x: dat, y: dDema[3][id], mode: 'lines', type: 'scatter', line: { color: 'lightgray', width: 1.5 }, name: 'dDema11' }; 
          //trach = { x: dat, y: anh[4][id], mode: 'lines', type: 'scatter', line: { color: 'brown', width: 1.5 }, name: 'anh4' };
          //tracl = { x: dat, y: anl[4][id], mode: 'lines', type: 'scatter', line: { color: 'goldenrod', width: 1.5 }, name: 'anl4' };
          data = [trace, tracn];
          ytit = 'dema11';   //+(i==0 ? 'p' : emaPer[i-1]);
          layout = { title: { text: coinSym[id], y: 0.9, pad: { t: 20 } }, width: width, height: height,
            xaxis: { title: 'dat', range: [dat[i1], dat[i2-1]], tickformat: '%m-%d %H', hoverformat: '%m-%d-%y %H:%M', tickfont: { size: 10 }, tickangle: -45, nticks: 6 }, 
            yaxis: { title: ytit, range: [ymin, ymax] },   // autorange: true },
            showlegend: false, 
          }; 
          //Plotly.newPlot(pltId, data, layout); 

          /* trcCol = color[2];
          trace = { x: dema[2][id], y: dema[4][id], mode: 'markers', type: 'scatter', marker: { color: trcCol, size: 4 }, name: 'dema11' };
          data = [trace];
          ytit = 'dema11';   
          layout = { title: { text: coinSym[id], y: 0.9, pad: { t: 20 } }, width: width, height: height,
            xaxis: { title: 'dat', range: [-4, 4] }, 
            yaxis: { title: ytit, range: [-4, 4] },   
            showlegend: false, 
          }; */
        } else if (iRow==1 && iCol==2) {
          trcCol = color[3];
          trace = { x: dat, y: dema[4][id], mode: 'lines', type: 'scatter', line: { color: trcCol, width: 1.5 }, name: 'dema20' };
          tracn = { x: dat, y: dDema[4][id], mode: 'lines', type: 'scatter', line: { color: 'lightgray', width: 1.5 }, name: 'dDema20' }; 
          //trach = { x: dat, y: anh[5][id], mode: 'lines', type: 'scatter', line: { color: 'brown', width: 1.5 }, name: 'anh5' };
          //tracl = { x: dat, y: anl[5][id], mode: 'lines', type: 'scatter', line: { color: 'goldenrod', width: 1.5 }, name: 'anl5' };
          data = [trace, tracn];
          ytit = 'dema20';   //+(i==0 ? 'p' : emaPer[i-1]);
          layout = { title: { text: coinSym[id], y: 0.9, pad: { t: 20 } }, width: width, height: height,
            xaxis: { title: 'dat', range: [dat[i1], dat[i2-1]], tickformat: '%m-%d %H', hoverformat: '%m-%d-%y %H:%M', tickfont: { size: 10 }, tickangle: -45, nticks: 6 }, 
            yaxis: { title: ytit, range: [ymin, ymax] },   // autorange: true },
            showlegend: false, 
          }; 
          //Plotly.newPlot(pltId, data, layout); 
        } else if (iRow==1 && iCol==0) {
          //if (coinSym[id]=='bnkr') {
          /* if (id.includes('grass')) {
            console.log('pltfig render pltfigrender pltfig render pltfigrender pltfig render pltfigrender pltfig render pltfigrender ');
            console.log('id', id, 'i1', i1, 'i2', i2, 'vol len', coinPrc[id].vol.length);
            for (iv=0; iv<coinPrc[id].vol.length; iv++) {
              console.log(iv, coinPrc[id].vol[iv]);
            }
          } */
          //console.log('pltfig id pltfig id pltfig id pltfig id pltfig id ', id)
            const vmin = math.min(coinPrc[id].vol.slice(i1, i2));
            const vmax = math.max(coinPrc[id].vol.slice(i1, i2));
            //trace = { x: dat, y: coinScorAll[id], mode: 'lines', type: 'scatter', line: { color: colorp, width: 1 }, name: 'scor' };
            //trace0 = { x: dat, y: coinScorAll0[id], mode: 'lines', type: 'scatter', line: { color: 'gray', width: 1 }, name: 'scor0' };
            trace = { x: dat, y: coinPrc[id].vol, mode: 'lines', type: 'scatter', line: { color: colorp, width: 1 }, name: 'vol' };
            //data = [trace, trace0];
            data = [trace];
            ytit = 'scor';  
            layout = { title: { text: coinSym[id], y: 0.9, pad: { t: 20 } }, width: width, height: height,
            xaxis: { title: 'dat', range: [dat[i1], dat[i2-1]], tickformat: '%m-%d %H', hoverformat: '%m-%d-%y %H:%M', tickfont: { size: 10 }, tickangle: -45, nticks: 6 }, 
            //yaxis: { title: ytit, range: [-1, 6] },   // autorange: true },
            yaxis: { title: ytit, range: [vmin, vmax] },   // autorange: true },
            showlegend: false,   
          }; 
        } else {
          const x = Array(10).fill(10).map(v => Math.random());
          const z = x.map(v => v**2);
          trace = { x: x, y: z, mode: 'lines', type: 'scatter', line: { color: 'blue', width: 1 }, name: pltId };
          data = [trace];
          layout = { title: { text: pltId, y: 0.9, pad: { t: 20 } }, width: 400, height: 260 };
          //Plotly.newPlot(pltId, data, layout); 
        } 
        
        //const srtId = pltId.slice(1).padStart(5, '0');
        const srtId = Math.ceil(Math.random()*100000);
        plots.push({ id: pltId, data: data, layout: layout, coinId: id, srtId: srtId });
        //console.log('plotspushid', pltId, layout);
      }
    }
  }
  //addDema();
  //console.log('call pltid 1'); pltid();

  console.log('call disp');
  displayPlots();
  //window.scrollTo(0, 0);

}


const pg = () => {
  console.log('pg');
  const pgDir = document.getElementById('pgDir').value;
  let pgJmp = Number(document.getElementById('pgJmp').value);
  //console.log('pgDir', pgDir, 'pgJmp', pgJmp);
  //console.log('nCoinPg', nCoinPg, 'iCoin0', iCoin0);

  if (isNaN(pgJmp) || pgJmp<=0) {
    pgJmp = nCoinPg-1;
    document.getElementById('pgJmp').value = pgJmp
  } 

  if (pgDir=='+') {
    iCoin0 = iCoin0+pgJmp;
    if (iCoin0>nCoin) {
      iCoin0 = nCoin-nCoinPg;
    }
  } else {
    iCoin0 = iCoin0-pgJmp;
    if (iCoin0<0) {
      iCoin0 = 0;
    }
  } 

  displayPlots(true);
  //window.scrollTo(0, 0);

  /* for (let iCoin=iCoin0; iCoin<iCoin0+nCoinPg; iCoin++) {
    for (let iRow=0; iRow<2; iRow++) {
      for (let iCol=0; iCol<3; iCol++) {
        pltId = `i${iCoin}r${iRow}${iCol}`;
        const plot1 = plots.find(v => v.id==pltId);
        Plotly.react(plot1.id, plot1.data, plot1.layout);
      }
    }
  } */
}


const find = () => {
  console.log('find');
  const findCoin = document.getElementById('find').value;
  console.log('findCoin', findCoin);
  const findSym = coinId.map(v => [v, coinSym[v]]).filter(v => v[1].indexOf(findCoin)>=0 || v[0].indexOf(findCoin)>=0);
  //for (let i=0; i<)
  console.log('findSym', 'len', findSym.length, findSym);
  let id;
  if (findSym.length>0) {
    if (findSym.length>1) {
      const findSym1 = findSym.filter(v => v[0].indexOf(findCoin)==0);
      //console.log('findSym1', findSym1);
      if (findSym1.length==1) {
        id = findSym1[0][0];
      } else {
        const lmin = math.min(findSym1.map(v => v[0].length));
        id = findSym1.filter(v => v[0].length==lmin)[0][0];
      }
    } else {
      id = findSym[0][0];
    }
    iCoin0 = coinNum[id];   // coinId.indexOf(id);
    console.log('icoin0', iCoin0);   //, coinId[iCoin0]);
    displayPlots();
  }
}


const lr_1slp = (x, z) => {   // mult 1d same slp
  ex = math.mean(x, 1);
  ez = math.mean(z, 1);
  exx = math.mean(math.dotPow(x, 2), 1);
  ezx = math.mean(math.dotMultiply(z, x), 1);
  a = math.mean(math.subtract(ezx, math.dotMultiply(ez, ex)), 0)/math.mean(math.subtract(exx, math.dotPow(ex, 2)), 0);
  return a;
}


const compSpr = () => {
  coinSpr = {};
  const l = coinPrc[idRef].prc.length;
  for (let id of coinId) {
    const spr = [ema[0][id][l-1], ema[1][id][l-1], ema[2][id][l-1]];
    coinSpr[id] = math.max(spr)/math.min(spr);
  }
}