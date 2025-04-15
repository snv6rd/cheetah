  function resize() {   // add +-
    console.log('resize', size, width, height);
    //const d = document.querySelectorAll('.plot'); console.log('d', d);
    if (size=='s') {
      width = 600;
      height = 400;
      size = 'm';
    } else if (size=='m') {
      width = 900;
      height = 600;
      size = 'l';
    } else if (size=='l') {
      width = 400;
      height = 260;
      size = 's';
    }
    /* for (let i = 0; i < 30; i++) {
      const plotDiv = document.getElementById(`plt${i}`);
      plotDiv.style.width = `${width}px`;
      plotDiv.style.height = `${height}px`;
      Plotly.relayout(plotDiv.id, { width: width, height: height });
    } */

    maxWidth = 3*width;
    maxHeight = nCoinPg*2*height;
    plotsContainer.style.width = `${maxWidth}px`;
    plotsContainer.style.height = `${maxHeight+100}px`;

    /* for (let iCoin=0; iCoin<nCoin; iCoin++) {
      for (let iRow=0; iRow<2; iRow++) {
        for (let iCol=0; iCol<3; iCol++) {
          pltId = `i${iCoin}r${iRow}${iCol}`;
          //console.log('iCoin', iCoin, iRow, iCol, 'pltId', pltId);
          const plotDiv = document.getElementById(pltId);
          plotDiv.style.width = `${width}px`;
          plotDiv.style.height = `${height}px`;
          Plotly.relayout(pltId, { width: width, height: height });
        }
      }
    } */

    //console.log('resize b4');
    /* document.querySelectorAll('.plot').forEach(plot => {
      if (plot.id!='') {
        const plotData = plots.find(p => p.id === plot.id);
        const i = coinNum[plotData.coinId];
        if (i>=10 && i<20) {
          const plotDiv = document.getElementById(plot.id);
          plotDiv.style.width = `${width}px`;
          plotDiv.style.height = `${height}px`;
          Plotly.relayout(plot.id, { width: width, height: height });
        }
      }
    }); */
    //console.log('resize af');

    /* for (i=0; i<plots.length; i++) {
      plots[i].layout.width = width; 
      plots[i].layout.height = height;
    } */
    plots.forEach(v => { v.layout.width = width; v.layout.height = height; } )

    displayPlots();

    /* const plotElement = document.getElementById(pltId); 
    if (plotElement) { 
      plotElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
      //const rect = plotElement.getBoundingClientRect(); window.scrollTo({ top: rect.top, behavior: 'smooth' });
    } */


    /* const www = []; 
    document.querySelectorAll('.plot').forEach(plot => {
      if (plot.id!='') {
        www.push(plot.id);
      }
    });
    console.log('www len', www.length, www);
    www.forEach(plotId => { 
      const plotDiv = document.getElementById(pltId);
      plotDiv.style.width = `${width}px`;
      plotDiv.style.height = `${height}px`;
    }); */

    //document.getElementById('resizeButton').addEventListener('click', () => {
    /* document.querySelectorAll('.plot').forEach(plot => {
      plot.style.width = `${width}px`;
      plot.style.height = `${height}px`;
      const plotData = plots.find(p => p.id === plot.id);
      if (plot.data) {
        observer.observe(plot);
        //console.log('plotid', plot.id, 'plotData', plotData);
      }
    }); */ 
    //});
  }


  const addMhl_o = () => {
    console.log('addMhl');
    mhlLen = document.getElementById('mhlLen').value;
    iMhl = emaPer.indexOf(Number(mhlLen));
    console.log('iMhl', iMhl, 'mhlLen', mhlLen);
    let y, ymin, ymax;
    for (let id of coinId) {
      let iCoin = coinNum[id];
      let iRow = 0, iCol = 0;
      const pltId = `i${iCoin}r${iRow}${iCol}`;
      Plotly.deleteTraces(pltId, [1,2,3,4]);
      const dat = coinPrc[id].dat.map((val) => fmtTs(val, 2));
      y = [...coinPrc[id].prc.slice(i1, i2), ...emax[iMhl][id].slice(i1, i2), ...emin[iMhl][id].slice(i1, i2)]; 
      trace = { x: dat, y: coinPrc[id].prc, mode: 'lines', type: 'scatter', line: { color: colorp, width: 1 }, name: 'prc' };
      const trach = { x: dat, y: emh[iMhl][id], mode: 'lines', type: 'scatter', line: { color: 'lightgray', width: 1 }, name: 'emh2' };
      const tracl = { x: dat, y: eml[iMhl][id], mode: 'lines', type: 'scatter', line: { color: 'lightgray', width: 1 }, name: 'eml2' };
      const trach1 = { x: dat, y: emax[iMhl][id], mode: 'lines', type: 'scatter', line: { color: 'brown', width: 1 }, name: 'emax2' };
      const tracl1 = { x: dat, y: emin[iMhl][id], mode: 'lines', type: 'scatter', line: { color: 'goldenrod', width: 1 }, name: 'emin2' };
      const data = [trach, tracl, trach1, tracl1];
      Plotly.addTraces(pltId, data);
      //const nTrc = !trnOn ? 0 : pltTrc[pltId].trn.length;
      //pltTrc[pltId].ema = math.range(1+nTrc, 1+nTrc+ema.length).valueOf();

      if (y.length>0) {
        ymin = math.min(y)*.99;
        ymax = math.max(y)*1.01;
        const update = { 'yaxis.range': [ymin, ymax] };
        Plotly.relayout(pltId, update);
      } 
    }
  }


  const addMsr = () => {    // chg 4 new mhlLen!=mhlLen - rm + add
    console.log('addMsr msrOn', msrOn);
    const msrLen1 = document.getElementById('msrLen').value;
    iMsr = emaPer.indexOf(Number(msrLen1));
    //console.log('iMsr', iMsr, 'msrLen1', msrLen1, 'msrLen', msrLen);
    if (mhlOn) {
      //mhlLen = document.getElementById('mhlLen').value;
      iMhl = emaPer.indexOf(Number(mhlLen));
      //console.log('iMhl', iMhl, 'mhlLen', mhlLen);
    }
    let y, ymin, ymax;
    if (!msrOn) {
      msrLen = msrLen1;
      //for (let id of coinId) {
      for (let iCoin=0; iCoin<nCoin; iCoin++) {
        //let iCoin = coinNum[id];
        let id = coinId[iCoin];
        let iRow = 0, iCol = 0;
        const pltId = `i${iCoin}r${iRow}${iCol}`;
        const dat = coinPrc[id].dat.map((val) => fmtTs(val, 2));
        y = [...coinPrc[id].prc.slice(i1, i2), ...emaxl[iMsr][id].slice(i1, i2), ...eminl[iMsr][id].slice(i1, i2)]; 
        trace = { x: dat, y: coinPrc[id].prc, mode: 'lines', type: 'scatter', line: { color: colorp, width: 1 }, name: 'prc' };
        const trach1 = { x: dat, y: emaxl[iMsr][id], mode: 'lines', type: 'scatter', line: { color: 'rgb(0, 50, 0)', width: 1 }, name: 'emaxl'+iMsr };
        const tracl1 = { x: dat, y: eminl[iMsr][id], mode: 'lines', type: 'scatter', line: { color: 'darkred', width: 1 }, name: 'eminl'+iMsr };
        const data = [trach1, tracl1];
        //Plotly.addTraces(pltId, data);
        const i = plots.findIndex(v => v.id==pltId);
        //plots[i].data = [...plots[i].data, ...data];

        nTrc = 1;
        if (emaOn) {
          nTrc += pltTrc[pltId].ema.length;
          for (let j=0; j<ema.length; j++) {
            y = [...y, ...ema[j][id].slice(i1, i2)];
          }
        }
        if (mhlOn) {
          nTrc += 3;
          y = [...y, ...emax[iMhl][id].slice(i1, i2), ...emin[iMhl][id].slice(i1, i2)]; 
        }
        pltTrc[pltId].msr = math.range(nTrc, nTrc+2).valueOf();
        pltDat[pltId].msr = data; 
        plots[i].data = Object.values(pltDat[pltId]).flat();
        y = plots[i].data.map(trc => trc.y.slice(i1, i2)).flat();

        if (y.length>0) {
          ymin = math.min(y)*.99;
          ymax = math.max(y)*1.01;
          //const update = { 'yaxis.range': [ymin, ymax] };
          //Plotly.relayout(pltId, update);
          plots[i].layout.yaxis.range = [ymin, ymax];
        } 
      }
      msrOn = true;
    } else {   // rm -> seprat
      //for (let id of coinId) {
      for (let iCoin=0; iCoin<nCoin; iCoin++) {
        //let iCoin = coinNum[id];
        let id = coinId[iCoin];
        let iRow = 0, iCol = 0;
        pltId = `i${iCoin}r${iRow}${iCol}`;
        y = coinPrc[id].prc.slice(i1, i2); 
        //const trace1 = pltTrc[pltId].msr;
        //Plotly.deleteTraces(pltId, trace1);
        const i = plots.findIndex(v => v.id==pltId);
        //plots[i].data = plots[i].data.filter((_, i) => !pltTrc[pltId].msr.includes(i));
        pltTrc[pltId].msr = [];
        pltDat[pltId].msr = [];
        plots[i].data = Object.values(pltDat[pltId]).flat();
        nTrc = 1;
        if (emaOn) {
          pltTrc[pltId].ema = math.range(nTrc, nTrc+pltTrc[pltId].ema.length).valueOf();
          nTrc += pltTrc[pltId].ema.length;
          for (let j=0; j<ema.length; j++) {
            y = [...y, ...ema[j][id].slice(i1, i2)];
          }
        }
        if (mhlOn) {
          pltTrc[pltId].mhl = math.range(nTrc, nTrc+3).valueOf();
          y = [...y, ...emax[iMhl][id].slice(i1, i2), ...emin[iMhl][id].slice(i1, i2)];
        }

        y = plots[i].data.map(trc => trc.y.slice(i1, i2)).flat();
        if (y.length>0) {
          ymin = math.min(y)*.99;
          ymax = math.max(y)*1.01;
          //const update = { 'yaxis.range': [ymin, ymax] };
          //Plotly.relayout(pltId, update);
          plots[i].layout.yaxis.range = [ymin, ymax];
        }
      }
      msrOn = false;
      if (msrLen1!=msrLen) {
        addMsr();
      }
    }
    displayPlots();
  } 


  const addMhl = () => {    
    console.log('addMhl mhlOn', mhlOn);
    const mhlLen1 = document.getElementById('mhlLen').value;
    iMhl = emaPer.indexOf(Number(mhlLen1));
    //console.log('iMhl', iMhl, 'mhlLen1', mhlLen1, 'mhlLen', mhlLen);
    if (msrOn) {
      //msrLen = document.getElementById('msrLen').value;
      iMsr = emaPer.indexOf(Number(msrLen));
      //console.log('iMsr', iMsr, 'msrLen', msrLen);
    }
    let y, ymin, ymax;
    if (!mhlOn) {
      mhlLen = mhlLen1;
      //for (let id of coinId) {
      for (let iCoin=0; iCoin<nCoin; iCoin++) {
        //let iCoin = coinNum[id];
        let id = coinId[iCoin];
        let iRow = 0, iCol = 0;
        const pltId = `i${iCoin}r${iRow}${iCol}`;
        const dat = coinPrc[id].dat.map((val) => fmtTs(val, 2));
        y = [...coinPrc[id].prc.slice(i1, i2), ...emax[iMhl][id].slice(i1, i2), ...emin[iMhl][id].slice(i1, i2)]; 
        trace = { x: dat, y: coinPrc[id].prc, mode: 'lines', type: 'scatter', line: { color: colorp, width: 1 }, name: 'prc' };
        const trach1 = { x: dat, y: emax[iMhl][id], mode: 'lines', type: 'scatter', line: { color: 'green', width: 1.5 }, name: 'emax'+iMhl };
        const tracl1 = { x: dat, y: emin[iMhl][id], mode: 'lines', type: 'scatter', line: { color: 'red', width: 1.5 }, name: 'emin'+iMhl };
        const tracm1 = { x: dat, y: emid[iMhl][id], mode: 'lines', type: 'scatter', line: { color: 'black', width: 1.5 }, name: 'emid'+iMhl };
        const data = [trach1, tracl1, tracm1];
        //Plotly.addTraces(pltId, data);
        const i = plots.findIndex(v => v.id==pltId);
        //plots[i].data = [...plots[i].data, ...data];
        pltDat[pltId].mhl = data;
        plots[i].data = Object.values(pltDat[pltId]).flat();

        nTrc = 1;
        if (emaOn) {
          nTrc += pltTrc[pltId].ema.length;
          for (let j=0; j<ema.length; j++) {
            y = [...y, ...ema[j][id].slice(i1, i2)];
          }
        }
        if (msrOn) {
          nTrc += 2;
          y = [...y, ...emaxl[iMsr][id].slice(i1, i2), ...eminl[iMsr][id].slice(i1, i2)]; 
        }
        pltTrc[pltId].mhl = math.range(nTrc, nTrc+3).valueOf();

        y = plots[i].data.map(trc => trc.y.slice(i1, i2)).flat();
        if (y.length>0) {
          ymin = math.min(y)*.99;
          ymax = math.max(y)*1.01;
          //const update = { 'yaxis.range': [ymin, ymax] };
          //Plotly.relayout(pltId, update);
          plots[i].layout.yaxis.range = [ymin, ymax];
        } 
      }
      mhlOn = true;
    } else {   // rm -> seprat
      //for (let id of coinId) {
      for (let iCoin=0; iCoin<nCoin; iCoin++) {
        //let iCoin = coinNum[id];
        let id = coinId[iCoin];
        let iRow = 0, iCol = 0;
        pltId = `i${iCoin}r${iRow}${iCol}`;
        y = coinPrc[id].prc.slice(i1, i2); 
        //const trace1 = pltTrc[pltId].mhl;
        //Plotly.deleteTraces(pltId, trace1);
        const i = plots.findIndex(v => v.id==pltId);
        //plots[i].data = plots[i].data.filter((_, i) => !pltTrc[pltId].mhl.includes(i));
        pltTrc[pltId].mhl = [];
        pltDat[pltId].mhl = [];
        plots[i].data = Object.values(pltDat[pltId]).flat();
        nTrc = 1;
        if (emaOn) {
          pltTrc[pltId].ema = math.range(nTrc, nTrc+pltTrc[pltId].ema.length).valueOf();
          nTrc += pltTrc[pltId].ema.length;
          for (let j=0; j<ema.length; j++) {
            y = [...y, ...ema[j][id].slice(i1, i2)];
          }
        }
        if (msrOn) {
          pltTrc[pltId].msr = math.range(nTrc, nTrc+2).valueOf();
          y = [...y, ...emaxl[iMsr][id].slice(i1, i2), ...eminl[iMsr][id].slice(i1, i2)];
        }

        y = plots[i].data.map(trc => trc.y.slice(i1, i2)).flat();
        if (y.length>0) {
          ymin = math.min(y)*.99;
          ymax = math.max(y)*1.01;
          //const update = { 'yaxis.range': [ymin, ymax] };
          //Plotly.relayout(pltId, update);
          plots[i].layout.yaxis.range = [ymin, ymax];
        }
      }
      mhlOn = false;
      if (mhlLen1!=mhlLen) {
        addMhl();
      }
    }
    displayPlots();
  } 


  const addEma = () => {   // rm loops
    console.log('addEma emaOn', emaOn);
    if (mhlOn) {
      mhlLen = document.getElementById('mhlLen').value;
      iMhl = emaPer.indexOf(Number(mhlLen));
      //console.log('iMhl', iMhl, 'mhlLen', mhlLen);
    }
    if (msrOn) {
      msrLen = document.getElementById('msrLen').value;
      iMsr = emaPer.indexOf(Number(msrLen));
      //console.log('iMsr', iMsr, 'mhlLen', msrLen);
    }

    let y, ymin, ymax;
    if (!emaOn) {
      //for (let iCoin=0; iCoin<nCoin; iCoin++) {
      iColor = 1;
      color = color1;
      //for (let id of coinId) {
      for (let iCoin=0; iCoin<nCoin; iCoin++) {
        //let iCoin = coinNum[id];
        let id = coinId[iCoin];
        let iRow = 0, iCol = 0;
        pltId = `i${iCoin}r${iRow}${iCol}`;
        //const id = coinId[iCoin];
        const dat = coinPrc[id].dat.map((val) => fmtTs(val, 2));
        y = coinPrc[id].prc.slice(i1, i2); 
        const trace1 = [];
        for (let j=0; j<ema.length; j++) {
          trace1[j] = { x: dat, y: ema[j][id], mode: 'lines', type: 'scatter', line: { color: color[j], width: 1 }, name: 'ema'+j };
          y = [...y, ...ema[j][id].slice(i1, i2)];
        }
        //console.log('id', id, 'pltId', pltId, 'ema0', ema[0][id][1000], 'prc', coinPrc[id].prc[1000]);
        //Plotly.addTraces(pltId, trace1);
        const i = plots.findIndex(v => v.id==pltId);
        pltDat[pltId].ema = trace1;
        plots[i].data = Object.values(pltDat[pltId]).flat();
        //plots[i].data = [...plots[i].data, ...trace1];
        //const nTrc = !trnOn ? 0 : pltTrc[pltId].trn.length;
        nTrc = 1;
        if (mhlOn) {
          nTrc += 3;
          y = [...y, ...emax[iMhl][id].slice(i1, i2), ...emin[iMhl][id].slice(i1, i2)];
        }
        if (msrOn) {
          nTrc += 2;
          y = [...y, ...emaxl[iMsr][id].slice(i1, i2), ...eminl[iMsr][id].slice(i1, i2)];
        }
        pltTrc[pltId].ema = math.range(nTrc, nTrc+ema.length).valueOf();

        y = plots[i].data.map(trc => trc.y.slice(i1, i2)).flat();
        if (y.length>0) {
          ymin = math.min(y)*.99;
          ymax = math.max(y)*1.01;
          //const update = { 'yaxis.range': [ymin, ymax] };
          //Plotly.relayout(pltId, update);
          plots[i].layout.yaxis.range = [ymin, ymax];
        }
      }
      emaOn = true;
    } else {
      //for (let id of coinId) {
      for (let iCoin=0; iCoin<nCoin; iCoin++) {
        //let iCoin = coinNum[id];
        let id = coinId[iCoin];
        let iRow = 0, iCol = 0;
        pltId = `i${iCoin}r${iRow}${iCol}`;
        //const id = coinId[iCoin];
        y = coinPrc[id].prc.slice(i1, i2); 
        //const trace1 = pltTrc[pltId].ema;
        //Plotly.deleteTraces(pltId, trace1);
        const i = plots.findIndex(v => v.id==pltId);
        plots[i].data = plots[i].data.filter((_, i) => !pltTrc[pltId].ema.includes(i));
        pltTrc[pltId].ema = [];
        pltDat[pltId].ema = [];
        plots[i].data = Object.values(pltDat[pltId]).flat();

        //if (trnOn) {
        //  pltTrc[pltId].trn = math.range(1, 1+pltTrc[pltId].trn.length).valueOf();
        //}
        nTrc = 1;
        if (mhlOn) {
          pltTrc[pltId].mhl = math.range(nTrc, nTrc+3).valueOf();
          nTrc += 3;
          y = [...y, ...emax[iMhl][id].slice(i1, i2), ...emin[iMhl][id].slice(i1, i2)];
        }
        if (msrOn) {
          pltTrc[pltId].msr = math.range(nTrc, nTrc+2).valueOf();
          y = [...y, ...emaxl[iMsr][id].slice(i1, i2), ...eminl[iMsr][id].slice(i1, i2)];
        }

        y = plots[i].data.map(trc => trc.y.slice(i1, i2)).flat();
        if (y.length>0) {
          ymin = math.min(y)*.99;
          ymax = math.max(y)*1.01;
          //const update = { 'yaxis.range': [ymin, ymax] };
          //Plotly.relayout(pltId, update);
          plots[i].layout.yaxis.range = [ymin, ymax];
        }
      }
      emaOn = false;
    }
    displayPlots();
  }
      

     /* for (let i = 0; i < 30; i++) {
        const id = coinId[i];
        const dat = coinPrc[id].dat.map((val) => fmtTs(val, 2));
        const trace1 = [];
        for (let j=0; j<ema.length; j++) {
          //trace1[j] = { x: dat.slice(i1, i2), y: ema[j][id].slice(i1, i2), type: 'line', line: { color: color[j], width: 1 }, name: 'ema'+j };
          trace1[j] = { x: dat, y: ema[j][id], mode: 'lines', type: 'scatter', line: { color: color[j], width: 1 }, name: 'ema'+j };
        }
        const pltId = `plt${i}`;
        Plotly.addTraces(pltId, trace1);
        const nTrc = !trnOn ? 0 : pltTrc[pltId].trn.length;
        pltTrc[pltId].ema = math.range(1+nTrc, 1+nTrc+ema.length).valueOf();
      }
      emaOn = true;
    } else {
      //const trace1 = math.range(1,ema.length+1).valueOf();
      for (let i = 0; i < 30; i++) {
        const pltId = `plt${i}`;
        const trace1 = pltTrc[pltId].ema;
        Plotly.deleteTraces(pltId, trace1);
        pltTrc[pltId].ema = [];
        if (trnOn) {
          pltTrc[pltId].trn = math.range(1, 1+pltTrc[pltId].trn.length).valueOf();
        }
      }
      emaOn = false;
    } */
  


  const addDema = () => {
    console.log('addDema'); 
    let y, ymin, ymax;
    //if (!emaOn) {
      for (let iCoin=0; iCoin<nCoin; iCoin++) {
        let iRow = 1, iCol = 0;
        pltId = `i${iCoin}r${iRow}${iCol}`;
        const id = coinId[iCoin];
        const dat = coinPrc[id].dat.map((val) => fmtTs(val, 2));
        y = [];
        const trace1 = [];
        for (let j=1; j<dema.length; j++) {
          trace1[j] = { x: dat, y: dema[j][id], mode: 'lines', type: 'scatter', line: { color: color[j-1], width: 1 }, name: 'dema'+j };
          y = [...y, ...dema[j][id].slice(i1, i2)];
        }
        //console.log('trace1 id', id, trace1); 
        Plotly.addTraces(pltId, trace1);
        //const nTrc = !trnOn ? 0 : pltTrc[pltId].trn.length;
        //pltTrc[pltId].ema = math.range(1+nTrc, 1+nTrc+ema.length).valueOf();

        if (y.length>0) {
          ymin = math.min(y);
          ymin = ymin>0 ? ymin*.99 : ymin*1.01;
          ymax = math.max(y);
          ymax = ymax>0 ? ymax*1.01 : ymax*.99;
          const update = { 'yaxis.range': [ymin, ymax] };
          Plotly.relayout(pltId, update);
        }
      }
    //  emaOn = true;
    /*} else {
      for (let iCoin=0; iCoin<maxPg; iCoin++) {
        let iRow = 0, iCol = 0;
        pltId = `i${iCoin}r${iRow}${iCol}`;
        const id = coinId[iCoin];
        y = coinPrc[id].prc.slice(i1, i2); 
        const trace1 = pltTrc[pltId].ema;
        Plotly.deleteTraces(pltId, trace1);
        pltTrc[pltId].ema = [];
        if (trnOn) {
          pltTrc[pltId].trn = math.range(1, 1+pltTrc[pltId].trn.length).valueOf();
        }
        if (y.length>0) {
          ymin = math.min(y)*.99;
          ymax = math.max(y)*1.01;
          const update = { 'yaxis.range': [ymin, ymax] };
          Plotly.relayout(pltId, update);
        }
      }
      emaOn = false;
    } */
  }


  const getStepSize = () => {
    const stepSize = Number(document.getElementById('stepSize').value);
    console.log('stepSize', stepSize);
    if (stepSize!=shftStep) {
      if (stepSize>0 && stepSize<maxStep) {
        shftStep = stepSize;
        expdStep = shftStep;
        //console.log('shftStep', shftStep);
      } else {
        document.getElementById('stepSize').value = shftStep;
      }
    }
  }


  const shft = () => {
    const shftDir = document.getElementById('shftDir').value;
    getStepSize();
    console.log('shft dir', shftDir, 'shftStep', shftStep);
    //const id0 = 'bitcoin';
    const l = coinPrc[idRef].prc.length;
    const d = i2-i1;
    //console.log('d', d, 'i1', i1, 'i2', i2);
    if (shftDir=='L') {
      if (i1<=0) {
        return;       
      }
      i1 = Math.max(i1-shftStep, 0);
      i2 = Math.min(i1+d, l);
      //i1 -= shftStep;
      //i2 -= shftStep;
    } else {
      if (i2>=l) {
        //const p1 = coinPrc[id0].prc.slice(i1, i2);
        //const d1 = coinPrc[id0].dat.slice(i1, i2);
        //console.log('p1', p1, 'd1', d1);
        return; 
      }
      i2 = Math.min(i2+shftStep, l);
      i1 = Math.max(i2-d, 0);
      //i1 += shftStep;
      //i2 += shftStep;
    }
    //console.log('shft i1', i1, 'i2', i2);
    
    //for (let iCoin=0; iCoin<nCoin; iCoin++) {
    for (let id of coinId) {
      //const id = coinId[iCoin];
      const dat = coinPrc[id].dat.map((val) => fmtTs(val, 2));
      let y, ymin, ymax;   // use yrng
      let iCoin = coinNum[id];
      for (let iRow=0; iRow<2; iRow++) {
        for (let iCol=0; iCol<3; iCol++) {
          pltId = `i${iCoin}r${iRow}${iCol}`;
          if (iRow==0 && iCol==0) {
            //y = coinPrc[id].prc.slice(i1, i2); 
            y = [...coinPrc[id].prc.slice(i1, i2), ...emax[iMhl][id].slice(i1, i2), ...emin[iMhl][id].slice(i1, i2)]; 
            if (emaOn) {
              for (let j=0; j<ema.length; j++) {
                y = [...y, ...ema[j][id].slice(i1, i2)];
              }
            }
          } else if (iRow==0 && iCol==1) {
            y = [dema[1][id].slice(i1, i2), ...dDema[1][id].slice(i1, i2)];
            //y = [...y, ...anh[2][id].slice(i1, i2), ...anl[2][id].slice(i1, i2)];
            //y = [coinPrc[id].prc.slice(i1, i2), ...emax[3][id].slice(i1, i2), ...emin[3][id].slice(i1, i2), ...emax[0][id].slice(i1, i2), ...emin[0][id].slice(i1, i2)];   //XXX
          } else if (iRow==0 && iCol==2) {
            y = [dema[2][id].slice(i1, i2), ...dDema[2][id].slice(i1, i2)];
            //y = [demax[1][id].slice(i1, i2), ...demin[1][id].slice(i1, i2)];
          } else if (iRow==1 && iCol==0) {
            //y = dema.slice(1).reduce((tot, val) => [...tot, ...val[id].slice(i1, i2)], []);
            y = [...coinPrc[id].vol.slice(i1, i2)];
          } else if (iRow==1 && iCol==1) {
            y = [dema[3][id].slice(i1, i2), ...dDema[3][id].slice(i1, i2)];
          } else if (iRow==1 && iCol==2) {
            y = [dema[4][id].slice(i1, i2), ...dDema[4][id].slice(i1, i2)];
          } else {
            y = [];
          }

          const i = plots.findIndex(v => v.id==pltId);
          //console.log('i', i, pltId, plots[i]);
          //for (let j=0; i<plots[i].data.length; j++) {
          //  console.log('i', i, 'j', j, pltId, plots[i].data[j]);
          //}
          //if (iRow==0 && iCol==0) {
          //if (iRow!=1 || iCol!=0) {   // *** FIX *****
            y = plots[i].data.map(trc => trc.y.slice(i1, i2)).flat();
          //}
          if (y.length>0) {
            ymin = math.min(y);
            ymin = ymin>0 ? ymin*.99 : ymin*1.01;   
            ymax = math.max(y);
            ymax = ymax>0 ? ymax*1.01 : ymax*.99;   
            //if (id=='monkey-pox' && iRow==1 && iCol==1) {
            //  console.log('shft', id, 'ymin', ymin, 'ymax', ymax);
            //}
            //const update = { 'xaxis.range': [dat[i1], dat[i2-1]], 'yaxis.range': [ymin, ymax] };

            plots[i].layout.xaxis.range = [dat[i1], dat[i2-1]];
            plots[i].layout.yaxis.range = [ymin, ymax];
            /* const plotData = plots.find(p => p.id === pltId);
            const iPlot = coinNum[plotData.coinId];
            if (iPlot>=10 && iPlot<20) {
              //pltId = `i${iCoin}r${iRow}${iCol}`;
              jj = plotId.indexOf('r');
              const pltId1 = `i${iPlot-10}${pltId.slice(jj)}`;
              Plotly.relayout(pltId1, update);
            } */

            /* if (iCoin>=iCoin0 && iCoin<iCoin0+nCoinPg) {
              const pltId1 = `i${iCoin-iCoin0}r${iRow}${iCol}`;
              Plotly.relayout(pltId1, update);
            } */
          }
        }
      }
    }

    displayPlots();
  }


  function expd(dir) {
    const expdDir = document.getElementById('expdDir').value;
    getStepSize();    
    console.log('expd dir', expdDir, 'expdStep', expdStep);
    //const id0 = 'bitcoin';
    const l = coinPrc[idRef].prc.length;
    const d = i2-i1;
    //console.log('d', d, 'i1', i1, 'i2', i2);
    if (expdDir=='+') {
      if (i1<=0 && i2>=l) {
        return; 
      }
      //console.log('i1-', i1-expdStep, 'i2+', i2+expdStep, 'l', l);
      i1 = Math.max(i1-expdStep, 0);
      i2 = Math.min(i2+expdStep, l);
      /* if (i1>=expdStep) {
        i1 -= expdStep;
      }
      if (i2<=coinPrc[idRef].prc.length-expdStep) {
        i2 += expdStep;
      } */
    } else {
      if (d<minD) {
      //if ((i2<expdStep && i1>coinPrc[idRef].prc.length-expdStep) || i2-i1<2*expdStep) {
        return; 
      }
      const expdStep1 = d<minD+2*expdStep ? (d-minD)/2 : expdStep; 
      i1 = Math.min(i1+expdStep1, l);
      i2 = Math.max(i2-expdStep1, 0);
      /* if (i1<=coinPrc[idRef].prc.length-expdStep) {
        i1 += expdStep;
      }
      if (i2>=expdStep) {
        i2 -= expdStep;
      } */
    }
    //console.log('expd i1', i1, 'i2', i2);

    //for (let iCoin=0; iCoin<nCoin; iCoin++) {
    for (let id of coinId) {
      //const id = coinId[iCoin];
      const dat = coinPrc[id].dat.map((val) => fmtTs(val, 2));
      let y, ymin, ymax;
      let iCoin = coinNum[id];
      for (let iRow=0; iRow<2; iRow++) {
        for (let iCol=0; iCol<3; iCol++) {
          pltId = `i${iCoin}r${iRow}${iCol}`;
          //[ymin, ymax] = yRng(id, iRow, iCol);

          const i = plots.findIndex(v => v.id==pltId);
          let y = [];
          if (iRow!=1 || iCol!=0) {
            y = plots[i].data.map(trc => trc.y.slice(i1, i2)).flat();
          }
          if (y.length>0) {
            ymin = math.min(y);
            ymin = ymin>0 ? ymin*.99 : ymin*1.01;   
            ymax = math.max(y);
            ymax = ymax>0 ? ymax*1.01 : ymax*.99;   
            plots[i].layout.xaxis.range = [dat[i1], dat[i2-1]];
            plots[i].layout.yaxis.range = [ymin, ymax];
          }

          //const update = { 'xaxis.range': [dat[i1], dat[i2-1]], 'yaxis.range': [ymin, ymax] };
          //Plotly.relayout(pltId, update);
          //const i = plots.findIndex(v => v.id==pltId);
          //plots[i].layout.xaxis.range = [dat[i1], dat[i2-1]];
          //plots[i].layout.yaxis.range = [ymin, ymax];
        }
      }
    }
    displayPlots();
    

    /* for (let i=0; i<30; i++) {
      const id = coinId[i];
      const dat = coinPrc[id].dat.map((val) => fmtTs(val, 2));
      const prc = coinPrc[id].prc.slice(i1, i2); 
      const ymin = math.min(prc)*.99;
      const ymax = math.max(prc)*1.01;
      //console.log('ymin', ymin, 'ymax', ymax);
      const update = {
        'xaxis.range': [dat[i1], dat[i2]], 
        'yaxis.range': [ymin, ymax]
      };
      Plotly.relayout(`plt${i}`, update);
    } */
  }


  function setChn() {
    console.log('setChn');
    const chn1 = document.getElementById('chn').value;  
    //console.log('chn1', chn1, 'chn', chn);
    const tfrm1 = document.getElementById('tfrm').value;  
    //console.log('tfrm1', tfrm1, 'tfrm', tfrm);
    if (chn1==chn && tfrm1==tfrm) {
      return;
    } 
    initVar();
    pltFig();

    /* const script = document.createElement('script'); 
    script.src = 'hyprChrt'; 
    script.onload = () => { 
    // This function will be called once the script is loaded displayContent(); };
      console.log('script', script);
      //console.load('coins', coins);
    } */
  }


  const addTrn = () => {
    console.log('addTrn trnOn', trnOn);
    if (!trnOn) {
      for (let i=0; i<30; i++) {
        const id = coinId[i];
        const dat = coinPrc[id].dat.map((val) => fmtTs(val, 2));
        const prc = coinPrc[id].prc; 
        const l = prc.length;

        const trn = [];
        for (let j=0; j<l; j++) {
        //const cnd = [ema[0][id][j]>ema[1][id][j], ema[1][id][j]>ema[2][id][j], ema[2][id][j]>ema[3][id][j]];
        //const cnd = [prc[j]>ema[3][id][j]];
          const cnd = [prc[j]>ema[1][id][j], ema[0][id][j]>ema[2][id][j], ema[1][id][j]>ema[3][id][j], ema[2][id][j]>ema[4][id][j]];
          trn[j] = math.sum(cnd.map((val) => val ? 1 : -1));
        //if (id=='bitcoin') {
        //  console.log('prcj', prc[j], ema[1][id][j], trn[j]);
        //}
        } 

        const s = [0];
        for (let j=1; j<l; j++) {
          if (trn[j]!=trn[j-1]) {
            s.push(j);
          }
        }
        s.push(l);
      
        const trace = [];
        for (let j=0; j<s.length-1; j++) {
          let cj;
        /* if (trn[s[j]]==1) {
          cj = 'green';
        } else if (trn[s[j]]==-1) {
          cj = 'red';
        } else {
          cj = 'yellow';
        } */
          if (trn[s[j]]==4) {
            cj = 'green';
          } else if (trn[s[j]]==2) {
            cj = 'cyan';
          } else if (trn[s[j]]==0) {
            cj = 'pink';
          } else if (trn[s[j]]==-2) {
            cj = 'orange';
          } else {
            cj = 'red';
          } 
          tj = { x: dat.slice(s[j], s[j+1]+1), y: prc.slice(s[j], s[j+1]+1), mode: 'lines', type: 'scatter', line: { color: cj, width: 2 } , name: 'ccc'}
          trace.push(tj);
        }
        const pltId = `plt${i}`;
        Plotly.addTraces(pltId, trace);
        trnOn = true;
        const nEma = !emaOn ? 0 : pltTrc[pltId].ema.length;
        pltTrc[pltId].trn = math.range(1+nEma, 1+nEma+trace.length).valueOf();
      }
    } else {
      //const trace1 = math.range(1,ema.length+1).valueOf();
      for (let i = 0; i < 30; i++) {
        const pltId = `plt${i}`;
        const trace1 = pltTrc[pltId].trn;
        Plotly.deleteTraces(pltId, trace1);
        pltTrc[pltId].trn = [];
        if (emaOn) {
          pltTrc[pltId].ema = math.range(1, 1+pltTrc[pltId].ema.length).valueOf();
        }
      }
      trnOn = false;
    }
  }


  const setColor = () => {
    console.log('setColor iColor', iColor);
    if (!emaOn) {
      //console.log('emaOn', emaOn);
      return;
    }
    if (iColor==0) {
      iColor = 1;
      color = color1;
    } else if (iColor==1) {
      iColor = 0;
      color = color0;
    } else {
      console.log('err iColor', iColor);
      return;
    }
    //console.log('new iColor', iColor);

    const pltId = [];
    for (let iCoin=0; iCoin<nCoin; iCoin++) {
      let iRow = 0, iCol = 0;
      const pltId1 = `i${iCoin}r${iRow}${iCol}`;
      pltId.push(pltId1);
    }

    //const plotDiv = document.getElementById('plt0');
    //Plotly.restyle(plotDiv, { 'line.color': color }, math.range(1, ema.length+1).valueOf());
    //const pltId = math.range(0, 30).valueOf().map((val) => 'plt'+val);  
    /* pltId.forEach(id => {
      const plotDiv = document.getElementById(id);
      //Plotly.restyle(plotDiv, { 'line.color': color }, math.range(1, ema.length+1).valueOf());   // chg range if trnOn 
      Plotly.restyle(plotDiv, { 'line.color': color }, pltTrc[id].ema); 
    }); */

    //console.log('color', color)
    pltId.forEach(id => {
      const i = plots.findIndex(v => v.id==id);
      //console.log('i', i, 'dat len', plots[i].data.length, 'ema len', ema.length);
      /* const q = pltTrc[id].ema;
      //for (let j=1; j<1+ema.length; j++) {
      for (let j of q) {
        //console.log('i', i, 'j', j, 'col', plots[i].data[j].line.color)
        plots[i].data[j].line.color = color[j-1];
      } */

      for (let j=0; j<pltDat[id].ema.length; j++) {
        pltDat[id].ema[j].line.color = color[j];
      }
      plots[i].data = Object.values(pltDat[id]).flat();

    });
    displayPlots();
  }


  const yRng = (id, iRow, iCol) => {
    //console.log('yRng', id, iRow, iCol);
    let y, ymin, ymax;
    if (iRow==0 && iCol==0) {
      //y = coinPrc[id].prc.slice(i1, i2); 
      y = [...coinPrc[id].prc.slice(i1, i2), ...emax[iMhl][id].slice(i1, i2), ...emin[iMhl][id].slice(i1, i2)]; 
      if (emaOn) {
        for (let j=0; j<ema.length; j++) {
          y = [...y, ...ema[j][id].slice(i1, i2)];
        }
      }
    } else if (iRow==0 && iCol==1) {
      y = [dema[1][id].slice(i1, i2), ...dDema[1][id].slice(i1, i2)];   // , ...emaxs[1][id].slice(i1, i2), ...emins[1][id].slice(i1, i2)];
      //y = [...y, ...anh[2][id].slice(i1, i2), ...anl[2][id].slice(i1, i2)];
      //y = [coinPrc[id].prc.slice(i1, i2), ...emax[3][id].slice(i1, i2), ...emin[3][id].slice(i1, i2)];
      //y = [coinPrc[id].prc.slice(i1, i2), ...emax[3][id].slice(i1, i2), ...emin[3][id].slice(i1, i2), ...emax[0][id].slice(i1, i2), ...emin[0][id].slice(i1, i2)];
    } else if (iRow==0 && iCol==2) {
      y = [dema[2][id].slice(i1, i2), ...dDema[2][id].slice(i1, i2)];
      //y = [demax[1][id].slice(i1, i2), ...demin[1][id].slice(i1, i2)];
    } else if (iRow==1 && iCol==0) {
      y = [];
      for (let j=1; j<dema.length; j++) {
        y = [...y, ...dema[j][id].slice(i1, i2)];
      }
      //y = dema.reduce((acc, curr) => [...acc, ...curr[id].slice(i1, i2)], []);
    } else if (iRow==1 && iCol==1) {
      y = [dema[3][id].slice(i1, i2), ...dDema[3][id].slice(i1, i2)];
    } else if (iRow==1 && iCol==2) {
      y = [dema[4][id].slice(i1, i2), ...dDema[4][id].slice(i1, i2)];
    } else {
      y = [];
    }
    //if (id=='monkey-pox' && iRow==1 && iCol==1) {
    //  console.log('yRng', id, math.min(y), math.max(y));
    //}

    /* console.log('coinId', coinId);
    console.log('plots', plots);
    const iCoin = coinId.indexOf(id);
    const pltId = `i${iCoin}r${iRow}${iCol}`;
    const i = plots.findIndex(v => v.id==pltId);
    console.log('i', i, 'pltId', pltId);
    y = plots[i].data.map(trc => trc.y.slice(i1, i2)).flat(); */

    if (y.length>0) {
      /* const q = math.max(math.abs(math.im(dema[1][id].slice(i1, i2))));
      const qq = math.max(math.abs(math.im(dDema[1][id].slice(i1, i2))));
      console.log('q', q, 'qq', qq); */ 
      ymin = math.min(y);
      ymin = ymin>0 ? ymin*.99 : ymin*1.01;
      ymax = math.max(y);
      ymax = ymax>0 ? ymax*1.01 : ymax*.99;
    }
    return [ymin, ymax]; 
  }