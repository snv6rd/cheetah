const ttt = () => {
  console.log('xx', xx);
  console.log('coinId', coinId)
}


//const emaPer = [3, 5, 11, 20, 40, 80];   // 2.5 10
//const sclPer = 24; // 36 48


const compSma = (per) => {
  console.log('compSma', per);
  const sma = {};
  for (let i=0; i<coinId.length; i++) {
    const id = coinId[i];
    const prc = coinPrc[id].prc;
    sma[id] = [];
    for (let j=per-1; j<prc.length; j++) {
      sma[id][j] = 0;
      for (let k=0; k<per; k++) {
        sma[id][j] += prc[j-per+1+k];
      }
      sma[id][j] /= per;
    } 
    for (let j=0; j<per-1; j++) {
      sma[id][j] = sma[id][per-1];
    }
  }
  //console.log('sma', sma.solana.length, sma.solana.slice(10,15))
  return sma;
}
    
  
const compEma = (per) => {   // strt at j=per
  console.log('comEma', per);
  const sma = {};
  for (let i=0; i<coinId.length; i++) {
    const id = coinId[i];
    const prc = coinPrc[id].prc;
    sma[id] = Array(prc.length).fill(0);  
    /* let j = 0;
    sma[id][j] = 0;
    for (let k=0; k<per; k++) {
      sma[id][j] += prc[j+k];
    }
    sma[id][j] /= per; */
    
    let k = prc.map(v => v>0).indexOf(true);
    if (k>=0) {
      //if (id=='scroll' || id=='bitcoin') {
      //  console.log('compEma per', per, id, k, k+per>prc.length);
      //}
      sma[id][k] = math.mean(prc.slice(k, k+per));
      for (let j=k+1; j<Math.min(k+per, prc.length); j++) {
        sma[id][j] = sma[id][k];
      }
      for (let j=k+per; j<prc.length; j++) {
        sma[id][j] = prc[j]*2/(per+1)+sma[id][j-1]*(1-2/(per+1));   // cdsk ~ 1-1/(per+1)   .76 .87 .93 .97 .98
      } 
      //if (id.includes('render')) {
      //  console.log(id, 'per', per, 'sma', sma[id])
      //}
    }
  }
  return sma;
}
    
  
const compEmax_o = (per) => {   // add emh eml = lbl emax hits hi, conn hi2hi + horiz
  const smax = {}, smin = {};
  //const lam = .999; 
  //const lam = (1-2/(per+1))/100+.99;    
  const lam = 1-2/(100*per+1);   // 60 200 400   // cdsk ~ 2->1
  for (let id of coinId) {
    const prc = coinPrc[id].prc;
    smax[id] = Array(prc.length).fill(0);  
    smin[id] = Array(prc.length).fill(0);  
    
    let k = prc.map(v => v>0).indexOf(true);
    if (k<0) {
      return;
    }
    smax[id][k] = math.max(prc.slice(k, k+per));
    smin[id][k] = math.min(prc.slice(k, k+per));
    for (let j=k+1; j<Math.min(k+per, prc.length); j++) {
      smax[id][j] = smax[id][k];
      smin[id][j] = smin[id][k];
    }
    for (let j=k+per; j<prc.length; j++) {
      //if (id=='aave' && per==40) {
      //  console.log('emax lam', lam, id, j, prc[j], smax[id][j-1], smax[id][j-1]*lam);
      //}
      smax[id][j] = Math.max(prc[j], smax[id][j-1]*lam);
      smin[id][j] = Math.min(prc[j], smin[id][j-1]/lam);
    } 
  }
  return [smax, smin];
}


const compEmax = (per, mul) => {   // speed by recurs   add mid
  const per1 = mul*per;
  const smax = {}, smin = {}, smid = {};
  for (let id of coinId) {
    const prc = coinPrc[id].prc;
    smax[id] = Array(prc.length).fill(0);  
    smin[id] = Array(prc.length).fill(0);  
    
    let k = prc.map(v => v>0).indexOf(true);
    if (k>=0) {
      //console.log('compEmax compEmax compEmax compEmax compEmax compEmax ', id, 'k', k, 'per', per, 'len', prc.length);
      smax[id][k] = math.max(prc.slice(k, k+per1));
      smin[id][k] = math.min(prc.slice(k, k+per1));
      for (let j=k+1; j<Math.min(k+per1, prc.length); j++) {
        smax[id][j] = smax[id][k];
        smin[id][j] = smin[id][k];
      }
      for (let j=k+per1; j<prc.length; j++) {
        //smax[id][j] = Math.max(prc[j], smax[id][j-1]*lam);
        //smin[id][j] = Math.min(prc[j], smin[id][j-1]/lam);
        smax[id][j] = math.max(prc.slice(j-per1+1, j+1));
        smin[id][j] = math.min(prc.slice(j-per1+1, j+1));
      }
    } 
    smid[id] = math.dotDivide(math.add(smax[id], smin[id]), 2); 
  }
  return [smax, smin, smid];
}


const compEmh = () => {   // trx 0901 eml
  console.log('compEmh'); 
  for (let j=0; j<emax.length; j++) {
  //for (let j=2; j<5; j++) {
    //console.log('j', j);
    hi[j] = {}, lo[j] = {};
    emh[j] = {}, eml[j] = {}, anh[j] = {}, anl[j] = {};
    for (let id of coinId) {
      const prc = coinPrc[id].prc;
      const i0 = prc.map(v => v>0).indexOf(true);
      hi[j][id] = [];
      lo[j][id] = [];
      hi[j][id][0] = i0; //Math.max(i0, 1);
      lo[j][id][0] = i0; //Math.max(i0, 1);
      //console.log('id', id, 'i0', i0, 'len', emax[j][id].length); 
      let prv = false;
      for (let i=i0; i<emax[j][id].length; i++) {
        /* if (prv && emax[j][id][i]>prc[i]) {
          hi[j][id].push(i-1);
        } else if (emax[j][id][i]<=prc[i]) {
          prv = true;
        } else {
          prv = false;
        } */
        if (emax[j][id][i]<=prc[i]) {
          prv = true;
        } else {
          if (prv) {
            hi[j][id].push(i-1);
          }
          prv = false;
        }  
      }
      if (prv) {
        hi[j][id].push(emax[j][id].length-1);
      }
      prv = false;
      for (let i=i0; i<emax[j][id].length; i++) {
        /* if (prv && emin[j][id][i]<prc[i]) {
          lo[j][id].push(i-1);
        } else if (emin[j][id][i]>=prc[i]) {
          prv = true;
        } else {
          prv = false;
        } */
        if (emin[j][id][i]>=prc[i]) {
          prv = true;
        } else {
          if (prv) {
            lo[j][id].push(i-1);
          }
          prv = false;
        } 
      }
      if (prv) {
        lo[j][id].push(emax[j][id].length-1);
      }
      //console.log('id1', id, 'hi', hi[j][id], 'lo', lo[j][id]); 

      let i1, i2;
      emh[j][id] = Array(prc.length).fill(0);
      anh[j][id] = Array(prc.length).fill(0);
      //let aprv = 0;
      for (let k=0; k<hi[j][id].length-1; k++) {
        i1 = hi[j][id][k];
        i2 = hi[j][id][k+1];
        const a = (prc[i2]-prc[i1])/(i2-i1);
        //const b = prc[i1]-a*i1;
        for (let i=i1; i<i2; i++) {
          emh[j][id][i] = a*(i-i1)+prc[i1];
          //anh[j][id][i] = aprv;   
        }
        //aprv = a*(i2-i1);
        const r = (prc[i2]/prc[i1]-1)*100/4;
        anh[j][id][i2] = r>0 ? Math.min(r, 2.5) : Math.max(r, -2.5);
      }
      for (let i=i2; i<prc.length; i++) {
        emh[j][id][i] = prc[i2]; 
      //  anh[j][id][i] = aprv;
      }

      eml[j][id] = Array(prc.length).fill(0);
      anl[j][id] = Array(prc.length).fill(0);
      //aprv = 0;
      for (let k=0; k<lo[j][id].length-1; k++) {
        i1 = lo[j][id][k];
        i2 = lo[j][id][k+1];
        const a = (prc[i2]-prc[i1])/(i2-i1);
        //const b = prc[i1]-a*i1;
        for (let i=i1; i<i2; i++) {
          eml[j][id][i] = a*(i-i1)+prc[i1];
          //anl[j][id][i] = aprv;
        }
        //aprv = a;
        const r = (prc[i2]/prc[i1]-1)*100/4;
        anl[j][id][i2] = r>0 ? Math.min(r, 2.5) : Math.max(r, -2.5);
      }
      for (let i=i2; i<prc.length; i++) {
        eml[j][id][i] = prc[i2]; 
      //  anl[j][id][i] = aprv; 
      }
      //console.log('id2', id); 
    } 
  }
}


const compPrc = (res) => {
  console.log('compPrc res', res);
  for (let i=0; i<coinId.length; i++) {
    const id = coinId[i];
    /* if (chn=='dxsc') {
      // if (i==0) {
      //  console.log('id0', id, 'chrt len', coins[id].chrt.length, coins[id].chrt);
      //} 
      //console.log('herehereherehereherehere', chn, res, id);
      const j = (coins[id].chrt.length-1)%1;
      //console.log('j', j, 'len', coins[id].chrt.length);
      coins[id].chrt = coins[id].chrt.filter((v, i) => i%1==j);
      //console.log('jj', j, 'len', coins[id].chrt.length);
      // if (i==0) {
      //  console.log('id1', id, 'chrt len', coins[id].chrt.length, coins[id].chrt);
      // } 
    } */
    //console.log('id', i, id)
    const prc = coins[id].chrt.map((val) => val[1]);
    const dat = coins[id].chrt.map((val) => val[0]);
    let vol;
    if (chn!='dxsc') {
      vol = coins[id].vol.map((val) => val[1]);
    } else {
      vol = coins[id].vol.map(v => v[1]);
      //vol = coins[id].vol.map((val) => val[1].h1);
      /* vol = coins[id].vol.map((val) => val[1]);
      for (let iv=0; iv<vol.length; iv++) {
        //console.log('vol iv', vol[iv]);
        //const k = Object.keys(vol[iv]);
        //console.log('k', k, 'k0', vol[iv][k[0]], 'tf', k[0]=='h1');
        //console.log('k', k, 'k0', vol[iv]['h1'], 'tf', k[0]=='h1');
        try {
          vol[iv] = vol[iv]['h1'];
        } catch(e) {
          //console.log('id', id, 'vol iv', iv, vol[iv]);
          vol[iv] = 0;
        }
      } */
      //if (id.includes('oxa')) {
      //  console.log('render vol render vol render vol render vol render vol ', id);
        //console.log(coins[id].vol)
        for (let iv=0; iv<coins[id].vol.length; iv++) {
          const q = vol[iv];   //coins[id].vol[iv];
        //  console.log(iv, q);   //[0], q[1].h1);
          if (q) {
            vol[iv] = q.h1;   //q[1].h1;
          } else {
            vol[iv] = 0;
          }
        }
      //} 
      //throw new Error("vol vol vol vol vol");
      //for (let iv=0 iv<coins[id].vol.length; iv++) {
      //  vol[iv] = coins[id].vol[1].h1;
      //} 
    } 
    //const datv = coins[id].vol.map((val) => val[0]);
    const dd = dat.map((val) => (new Date(val)).toUTCString().slice(5 ,7));
    const hr = dat.map((val) => (new Date(val)).toUTCString().slice(17, 19));
    //const ddv = datv.map((val) => (new Date(val)).toUTCString().slice(5 ,7));
    const l = dat.length;
 
    coinPrc[id] = {};
    //if (id=='bitcoin') {
    //  console.log('prcprcprcprcprcprcpc');
    //}
    const cnd0 = chn!='dxsc';
    const cnd1 = tfrm=='1d';
    const cnd1a = dd[l-1]==dd[l-2];
    //const cnd1av = ddv[l-1]==ddv[l-2];
    const cnd2 = (tfrm=='1h' || tfrm=='4h');
    const cnd2a = hr[l-1]==hr[l-2];
    //console.log('cnd0', cnd0, 'cnd1', cnd1, 'cnd2', cnd2);

    //if (cnd1a!=cnd1av) {
    //  console.log('voldat voldat voldat voldat voldat', cnd1a, cnd1av);
    //}
      if (cnd0 && vol.length!=l) {
        console.log('vol len', vol.length, 'l', l, 'id', id);
        //throw new Error("vol len err");
        const lVol = vol.length; 
        if (lVol>l) {
          vol = vol.slice(0, l);
        } else { 
          for (let iVol=lVol; iVol<l; iVol++) {
            vol.push(vol[iVol-1]);
          }
        }
      }
    /* if (id.includes('render')) {
      console.log('new vol render new vol render new vol render new vol render new vol render new vol render ');
      for (let iv=0; iv<vol.length; iv++) {
        console.log(iv, vol[iv]);
      }
    } */
    if (cnd0 && cnd1) {
      if (cnd1a) {
        prc.pop();
        dat.pop();
        vol.pop();
        dd.pop();
      }
      coinPrc[id].prc = prc.slice();
      coinPrc[id].dat = dat.slice();
      coinPrc[id].vol = vol.slice();
    } else if (cnd0 && cnd2) {
      if (cnd2a) {
        prc.pop();
        dat.pop();
        vol.pop();
        hr.pop();
      }
      //coinPrc[id].prc = prc.filter((_, ind) => hr[ind]%res==0);
      //coinPrc[id].dat = dat.filter((_, ind) => hr[ind]%res==0);
      if (res==1) {
        coinPrc[id].prc = prc.slice();
        coinPrc[id].dat = dat.slice();
        coinPrc[id].vol = vol.slice();
      } else {
        const j = (prc.length-1)%res;
        coinPrc[id].prc = prc.filter((_, ind) => ind%res==j);
        coinPrc[id].dat = dat.filter((_, ind) => ind%res==j);
        coinPrc[id].vol = vol.filter((_, ind) => ind%res==j);   // chg -> sum(vol)
      }

    } else if (!cnd0) {
      /* if (tfrm=='4h') {
        res = 3;
      } else if (tfrm=='1d') {
        res = 12;
      } */
      //console.log('id', id, 'len', prc.length);
      if (res==1) {
        coinPrc[id].prc = prc.slice();
        coinPrc[id].dat = dat.slice();
        coinPrc[id].vol = vol.slice();
      } else {
        const j = (prc.length-1)%res;
        if (id.includes('render')) {
          console.log('res res res res res res res ', id, 'len', prc.length, 'j', j);
        }
        coinPrc[id].prc = prc.filter((_, ind) => ind%res==j);
        coinPrc[id].dat = dat.filter((_, ind) => ind%res==j);
        coinPrc[id].vol = vol.filter((_, ind) => ind%res==j);   // chg -> sum(vol)
      }
      //coinPrc[id].vol = Array(coinPrc[id].prc.length).fill(0);
    } 

    //coinPrc[id].prc = prc.filter((_, ind) => hr[ind]%res==0);
    //coinPrc[id].dat = dat.filter((_, ind) => hr[ind]%res==0);

    /* if (id.includes('grass')) {
      console.log('new vol render new vol render new vol render new vol render new vol render new vol render ');
      console.log('chn', chn, 'res', res);
      for (let iv=0; iv<vol.length; iv++) {
        console.log(iv, coinPrc[id].vol[iv]);
      }
    } */


  }
  //wrtJson(coinPrc, 'coinPrc');

  const id = 'bankercoin-2';
  //console.log('prc len', coinPrc[id].prc.length, 'vol len', coinPrc[id].vol.length);
  if (coinPrc[id]) {
    console.log('compPrc vollen vollen vollen vollen vollen vollen vollen vollen vollen ');
    console.log('prc', coinPrc[id].prc.length, 'vol', coinPrc[id].vol.length, 'ref', coinPrc[idRef].prc.length, 'i1', i1, 'i2', i2);
  }
  
  fillPrc();
  /* ema[0] = compEma(3); 
  ema[1] = compEma(5);  // 8 10
  ema[2] = compEma(11);  // 13 20
  ema[3] = compEma(20);
  ema[4] = compEma(40);
  ema[5] = compEma(80); */

  for (let i=0; i<emaPer.length; i++) {
    ema[i] = compEma(emaPer[i]); 
    //if (i==1) {
    //  console.log('ema1 ema1 ema1 ema1 ema1', ema[1])
    //}
    [emax[i], emin[i], emid[i]] = compEmax(emaPer[i], 1); 
    [emaxl[i], eminl[i]] = compEmax(emaPer[i], 6);  
  } 

  //console.log('ccccccccc', coinPrc['bitcoin']);
  //compNxt(12);
}


const fillPrc = () => {   // fillvol
  //const id0 = 'bitcoin';
  console.log('fillPrc');
  console.log(idRef, coinPrc[idRef]);
  //console.log('idRef', idRef);
  const l = coinPrc[idRef].prc.length;
  //console.log('l', l);
  for (let id of coinId) {
    const l1 = coinPrc[id].prc.length;
    //console.log('l1 id', id, l1);
    if (l1<l) {
      coinPrc[id].prc.unshift(...Array(l-l1).fill(0));
      coinPrc[id].vol.unshift(...Array(l-l1).fill(0));
      //coinPrc[id].dat.unshift(...coinPrc[idRef].dat.slice(0,l-l1));
      const onehr = 3600000;
      const i1 = coinPrc[id].dat[0]-onehr*(l-l1);
      const i2 = coinPrc[id].dat[0];   
      //console.log('onehr', onehr, onehr*(l-l1), coinPrc[id].dat[0], coinPrc[id].dat[0]-onehr*(l-l1));
      //console.log('unshift', id, 'i1', i1, 'i2', i2, 'l', l, 'l1', l1);
      //console.log('unshift len', math.range(i1, i2, onehr).toArray().length); //, math.range(i1, i2, onehr).slice(0, 10));
      coinPrc[id].dat.unshift(...math.range(i1, i2, onehr).toArray());
    } else if (l1>l) {
      coinPrc[id].prc.splice(0,l1-l);
      coinPrc[id].dat.splice(0,l1-l);
      coinPrc[id].vol.splice(0,l1-l);
    }
    //console.log('fillPrc id', id, l1, coinPrc[id].prc[0]);
  }
}


const compNxt = (n) => {
  console.log('compNxt', n);  
  const l = coinPrc[idRef].prc.length;
  //console.log('l', l);
  for (let id of coinId) {
    const prc = coinPrc[id].prc;
    const i0 = prc.map(v => v>0).indexOf(true);
    let ret = prc.slice(i0+1).map((v, i) => v/prc[i0+i]-1);   
    ret = math.dotDivide(math.subtract(ret, math.mean(ret)), math.std(ret));
    ret = [ret[0], ...ret];
    const nxt = ret.slice(0, l-n-i0).map((_, i) => math.mean(ret.slice(i+1, i+n+1))); 
    const nxt1 = Array(l).fill(0);
    nxt1.splice(i0, nxt.length, ...nxt);
    nxtRet[id] = nxt1;
    // nxtRet[id] = [...Array(i0).fill(0), ...nxt, ...Array(n).fill(0)];
    // same4 nxt2
  } 
  //console.log('nxtRet', nxtRet);
  for (let id of coinId) {
    console.log('ret max', id, math.max(math.abs(nxtRet[id])));
  }
}


const compDema = () => {   // add plt
  console.log('compDema');
  //for (let id of ['scroll', 'bitcoin']) {
  //  console.log(id, coinPrc[id].prc.length, ema[0][id].length, ema[1][id].length, ema[2][id].length, ema[3][id].length, ema[4][id].length, ema[5][id].length);
  //}
  for (let i=0; i<5; i++) {
    dema[i] = {};
    emaxs[i] = {}, emins[i] = {};
  }
  for (let i=0; i<coinId.length; i++) {
    const id = coinId[i];
    //console.log(id, coinPrc[id].prc)
    //console.log('ema', ema[1])
    dema[0][id] = math.subtract(coinPrc[id].prc, ema[1][id]);
    dema[1][id] = math.subtract(ema[0][id], ema[2][id]);
    dema[2][id] = math.subtract(ema[1][id], ema[3][id]);
    dema[3][id] = math.subtract(ema[2][id], ema[4][id]);
    dema[4][id] = math.subtract(ema[3][id], ema[5][id]);
    //console.log('emax0 id', id, emaxs[1][id]);  // init emaxs[]=...
    
    emaxs[1][id] = math.subtract(emax[0][id], ema[2][id]);
    emaxs[2][id] = math.subtract(emax[1][id], ema[3][id]);
    emaxs[3][id] = math.subtract(emax[2][id], ema[4][id]);
    emaxs[4][id] = math.subtract(emax[3][id], ema[5][id]);
    emins[1][id] = math.subtract(emin[0][id], ema[2][id]);
    emins[2][id] = math.subtract(emin[1][id], ema[3][id]);
    emins[3][id] = math.subtract(emin[2][id], ema[4][id]);
    emins[4][id] = math.subtract(emin[3][id], ema[5][id]);
  }
}


const difDema = () => {
  console.log('difDema');
  for (let i=0; i<dema.length; i++) {
    dDema[i] = {};
  }
  for (let i=0; i<coinId.length; i++) {
    const id = coinId[i];
    /* dDema[0][id] = [];
    for (let j=1; j<dema[0][id].length; j++) {
      dDema[0][id][j] = dema[0][id][j]-dema[0][id][j-1];
    }
    dDema[0][id][0] = dDema[0][id][1]; 
    let q = math.subtract(dema[0][id].slice(1), dema[0][id].slice(0,dema[0][id].length-1));
    q = [q[0], ...q];
    console.log(id, math.max(math.abs(math.subtract(dDema[0][id], q)))); */
    
    const i0 = coinPrc[id].prc.map(v => v>0).indexOf(true);
    /* for (let j=0; j<dema.length; j++) {
      const q = math.subtract(dema[j][id].slice(1), dema[j][id].slice(0,dema[j][id].length-1));
      dDema[j][id] = [q[0], ...q];
      if (i0>0) {
        dDema[j][id][i0] = dDema[j][id][i0-1];
      }
    } */
    for (let j=1; j<dema.length; j++) {// ----- DIFDEMA CHG see sclddema ----------
      const q = math.subtract(ema[j-1][id].slice(1), ema[j-1][id].slice(0,ema[j-1][id].length-1));
      dDema[j][id] = [q[0], ...q];
      if (i0>0) {
        dDema[j][id][i0] = dDema[j][id][i0-1];
      }
    } 
  }
}


const compDemax = () => {   
  console.log('compDemax');
  for (let i=0; i<5; i++) {
    demax[i] = {};
    demin[i] = {};
  }
  for (let id of coinId) {
    demax[0][id] = math.subtract(coinPrc[id].prc, emax[1][id]);
    demax[1][id] = math.subtract(emax[0][id], emax[2][id]);
    demax[2][id] = math.subtract(emax[1][id], emax[3][id]);
    demax[3][id] = math.subtract(emax[2][id], emax[4][id]);
    demax[4][id] = math.subtract(emax[3][id], emax[5][id]);
    demin[0][id] = math.subtract(coinPrc[id].prc, emin[1][id]);
    demin[1][id] = math.subtract(emin[0][id], emin[2][id]);
    demin[2][id] = math.subtract(emin[1][id], emin[3][id]);
    demin[3][id] = math.subtract(emin[2][id], emin[4][id]);
    demin[4][id] = math.subtract(emin[3][id], emin[5][id]);
  }
}


/* const compDema_o = () => {   // add plt
  for (let i=0; i<ema.length-1; i++) {
    dema[i] = {};
  }
  for (let i=0; i<coinId.length; i++) {
    const id = coinId[i];
    dema[0][id] = math.subtract(coinPrc[id].prc, ema[1][id]);
    dema[1][id] = math.subtract(ema[0][id], ema[2][id]);
    dema[2][id] = math.subtract(ema[1][id], ema[3][id]);
    dema[3][id] = math.subtract(ema[2][id], ema[4][id]);
    dema[4][id] = math.subtract(ema[3][id], ema[5][id]);
  }
} */


const sclDema_o = (mul) => {   // sav muj sigj   rm loops
  console.log('sclDema');
  for (let i=0; i<coinId.length; i++) {
  //for (let i=0; i<5; i++) {
    const id = coinId[i]; 
    console.log(i, id)
    for (let j = 0; j<dema.length; j++) {

      /* const mu = [], sig = [];
      mu[0] = math.mean(dema[j][id].slice(0, sclPer1));
      sig[0] = math.std(dema[j][id].slice(0, sclPer1));
      for (let k=1; k<dema[j][id].length; k++) {
        if (k<sclPer1) {
          mu[k] = mu[0];
          sig[k] = sig[0];
        } else {
          mu[k] = math.mean(dema[j][id].slice(k-sclPer1+1, k+1));
          sig[k] = math.std(dema[j][id].slice(k-sclPer1+1, k+1));
        }
      } */
      //dema[j][id] = math.dotDivide(math.subtract(dema[j][id], mu), sig);
      
      let mu1, sig1;
      if (mul==0) {
        mu1 = math.mean(dema[j][id]);
        sig1 = math.std(dema[j][id]);
      } else {
        const sclPer1 = (j==0 ? sclPer : sclPer*mul*emaPer[j-1]);
        //console.log('sclPer1 j', j, sclPer1);
        mu1 = Array(dema[j][id].length).fill(0); 
        sig1 = Array(dema[j][id].length).fill(0); 
        //let mu1 = Array.from({ length: dema[j][id].length }); 
        //let sig1 = Array.from({ length: dema[j][id].length }); 
        mu1[0] = math.mean(dema[j][id].slice(0, sclPer1));
        sig1[0] = math.std(dema[j][id].slice(0, sclPer1));
        mu1 = mu1.map((_, k) => k<sclPer1 ? mu1[0] : math.mean(dema[j][id].slice(k-sclPer1+1, k+1)));
        sig1 = sig1.map((_, k) => k<sclPer1 ? sig1[0] : math.std(dema[j][id].slice(k-sclPer1+1, k+1)));

        const [mu2, sig2] = f1a(dema[j][id], sclPer1, 1);
        console.log('dmu', id, j, math.max(math.abs(math.subtract(mu2, mu1))));
        console.log('dsig', id, j, math.max(math.abs(math.subtract(sig2, sig1))));
      }
      //if (i<10) {
      //  console.log('dif', i, id, math.max(math.abs(math.subtract(mu1, mu))), math.mean(math.abs(math.subtract(sig1, sig))));
      //}
      dema[j][id] = math.dotDivide(math.subtract(dema[j][id], mu1), sig1);
    }
  }
}


const sclDema = (mul) => {   // sav muj sigj   rm loops   !disp prc=0
  console.log('sclDema');
  for (let i=0; i<coinId.length; i++) {
  //for (let i=0; i<5; i++) {
    const id = coinId[i]; 
    //console.log(i, id);
    const i0 = coinPrc[id].prc.map(v => v>0).indexOf(true);
    //console.log('i0', i0);
    for (let j = 0; j<dema.length; j++) {
      let mu1, sig1;
      if (mul==0) {
        mu1 = math.mean(dema[j][id].slice(i0));
        sig1 = math.std(dema[j][id].slice(i0));
      } else {
        const sclPer1 = (j==0 ? sclPer : sclPer*mul*emaPer[j-1]);
        [mu1, sig1] = f1a(dema[j][id].slice(i0), sclPer1, 1);
      }
      sig1 = math.abs(sig1);   // miteb cmplx due2 numerr
      if (id.slice(0, 7)=='lai-sol') {
        //console.log('mu1', mu1, 'sig1', sig1);
        const q = math.max(math.abs(math.im(sig1)));
        if (q>0) {
          console.log('sclDema id sclDema id sclDema id sclDema id sclDema id sclDema id ', id);
          for (let ii=0; ii<sig1.length; ii++) {
            if (math.abs(math.im(sig1[ii]))==q) {
              console.log('im sig1 j', j, q, 'ii', ii);
              console.log('mu1', mu1[ii], 'sig1', sig1[ii]);
            }
          }
        }
        
      }
      //sig1 = sig1.map(v => v<=0 ? 0.0001 : v);
      //dema[j][id] = math.dotDivide(math.subtract(dema[j][id].slice(i0), mu1), sig1);
      //const dema1 = math.dotDivide(math.subtract(dema[j][id].slice(i0), mu1), sig1);
      const dema1 = math.dotDivide(math.subtract(dema[j][id].slice(i0), 0), sig1);
      //console.log('j', j, 'len', dema[j][id].length, dema1.length, mu1.length, sig1.length, 'min', math.min(sig1));
      dema[j][id].splice(i0, dema1.length, ...dema1);
      //if (id=='aave') {
      //  console.log('emaxs id', id, 'j', j, emaxs[j][id]);
      //}
      if (j>0) {
        let emax1 = math.dotDivide(math.subtract(emaxs[j][id].slice(i0), mu1), sig1);
        emaxs[j][id].splice(i0, emax1.length, ...emax1);
        emax1 = math.dotDivide(math.subtract(emins[j][id].slice(i0), mu1), sig1);
        emins[j][id].splice(i0, emax1.length, ...emax1);
      }
    }
  }
  //const y = dema[3]['monkey-pox'];
  //console.log('sclDema', math.min(y), math.max(y));
}


const sclDemax = (mul) => {   
  console.log('sclDemax');
  for (let id of coinId) { 
    const i0 = coinPrc[id].prc.map(v => v>0).indexOf(true);
    for (let j=0; j<demax.length; j++) {
      let mu1, sig1;
      //if (mul==0) {
        mu1 = math.mean(demax[j][id].slice(i0));
        sig1 = math.std(demax[j][id].slice(i0));
      //} else {
      //  const sclPer1 = (j==0 ? sclPer : sclPer*mul*emaPer[j-1]);   // chg
      //  [mu1, sig1] = f1a(demax[j][id].slice(i0), sclPer1, 1);
      //}
      //let demax1 = math.dotDivide(math.subtract(demax[j][id].slice(i0), mu1), sig1*1);
      let demax1 = math.dotDivide(demax[j][id].slice(i0), mu1);
      demax[j][id].splice(i0, demax1.length, ...demax1);
      mu1 = math.mean(demin[j][id].slice(i0));
      sig1 = math.std(demin[j][id].slice(i0));
      //demax1 = math.dotDivide(math.subtract(demin[j][id].slice(i0), mu1), sig1*1);
      demax1 = math.dotDivide(demin[j][id].slice(i0), mu1);
      demin[j][id].splice(i0, demax1.length, ...demax1);
    }
  }
}


const sclDDema = (mul) => {   // sav muj sigj   rm loops   !disp prc=0
  console.log('sclDDema');
  for (let i=0; i<coinId.length; i++) {
    const id = coinId[i]; 
    const i0 = coinPrc[id].prc.map(v => v>0).indexOf(true);
    for (let j = 1; j<dema.length; j++) {         // ----- DIFDEMA CHG j=0 ----------
      let mu1, sig1;
      if (mul==0) {
        mu1 = math.mean(dDema[j][id].slice(i0));
        sig1 = math.std(dDema[j][id].slice(i0));
      } else {
        const sclPer1 = (j==0 ? sclPer : sclPer*mul*emaPer[j-1]);
        [mu1, sig1] = f1a(dDema[j][id].slice(i0), sclPer1, 1);
      }
      sig1 = math.abs(sig1);   // miteb cmplx due2 numerr
      let dema1 = math.dotDivide(math.subtract(dDema[j][id].slice(i0), 0), sig1);   // .map(v => v/2);  // ----- DIFDEMA CHG j=0 ----------
      const demaAv = 6;
      dema1 = dema1.map((_, k) => k<demaAv-1 ? math.mean(dema1.slice(0, k+1)) : math.mean(dema1.slice(k-demaAv+1, k+1)));
      // av
      dDema[j][id].splice(i0, dema1.length, ...dema1);
    }
  }
}


const sclAnh = (mul) => {   // sav muj sigj   rm loops   !disp prc=0
  console.log('sclAnh');
  for (let i=0; i<coinId.length; i++) {
    const id = coinId[i]; 
    const i0 = coinPrc[id].prc.map(v => v>0).indexOf(true);
    for (let j=0; j<anh.length; j++) {
      let mu1, sig1;
      if (mul==0) {
        mu1 = math.mean(anh[j][id].slice(i0));
        sig1 = math.std(anh[j][id].slice(i0));
      } else {
        const sclPer1 = (j==0 ? sclPer : sclPer*mul*emaPer[j-1]);
        [mu1, sig1] = f1a(anh[j][id].slice(i0), sclPer1, 1);
      }
      sig1 = 5;
      const anh1 = math.dotDivide(math.subtract(anh[j][id].slice(i0), 0), sig1);
      anh[j][id].splice(i0, anh1.length, ...anh1);
    }
    for (let j=0; j<anl.length; j++) {
      let mu1, sig1;
      if (mul==0) {
        mu1 = math.mean(anl[j][id].slice(i0));
        sig1 = math.std(anl[j][id].slice(i0));
      } else {
        const sclPer1 = (j==0 ? sclPer : sclPer*mul*emaPer[j-1]);
        [mu1, sig1] = f1a(anl[j][id].slice(i0), sclPer1, 1);
      }
      sig1 = 5;
      const anl1 = math.dotDivide(math.subtract(anl[j][id].slice(i0), 0), sig1);
      anl[j][id].splice(i0, anl1.length, ...anl1);
    }
  }
}


const f1a = (x, per, inorm) => {
  const l = x.length;
  const s = Array(l).fill(0);
  s.fill(math.sum(x.slice(0, per)), 0, per);
  s.slice(per).forEach((_, i) => { const j = i+per; s[j] = s[j-1]+x[j]-x[i]; });
  const mu = math.divide(s, per);

  const x2 = math.dotPow(x, 2);
  s.fill(math.sum(x2.slice(0, per)), 0, per);
  s.slice(per).forEach((_, i) => { const j = i+per; s[j] = s[j-1]+x2[j]-x2[i]; });
  let mu2 = math.dotPow(mu, 2);
  if (inorm!=0) {
    mu2 = math.multiply(mu2, per/(per-inorm));
  }
  const sig = math.subtract(math.divide(s, per-inorm), mu2).map(v => math.sqrt(v));
  
  return [mu, sig];
} 


const sclDema1 = (mul) => {
  console.log('sclDema1');
  let mu1, sig1;
  for (let i=0; i<5; i++) {   // coinId.length
    const id = coinId[i]; 
    //console.log(i, id);
    if (mul==0) {
      for (let j=0; j<dema.length; j++) {
        mu1 = math.mean(dema[j][id]);
        sig1 = math.std(dema[j][id]);
        dema[j][id] = math.dotDivide(math.subtract(dema[j][id], mu1), sig1);
      }
    } else {
      for (let j=0; j<dema.length; j++) {
        const sclPer1 = (j==0 ? sclPer : sclPer*mul*emaPer[j-1]);
        mu1 = Array(dema[j][id].length).fill(0); 
        sig1 = Array(dema[j][id].length).fill(0); 
        mu1[0] = math.mean(dema[j][id].slice(0, sclPer1));
        sig1[0] = math.std(dema[j][id].slice(0, sclPer1));
        mu1 = mu1.map((_, k) => k<sclPer1 ? mu1[0] : math.mean(dema[j][id].slice(k-sclPer1+1, k+1)));
        sig1 = sig1.map((_, k) => k<sclPer1 ? sig1[0] : math.std(dema[j][id].slice(k-sclPer1+1, k+1)));
        dema[j][id] = math.dotDivide(math.subtract(dema[j][id], mu1), sig1);
      }
    }
  }
}

// arrayfill(0,per)   mu=prevmu+new-old   m2 same   var=m2-mu^2 -> std
/* --- gpt   
for (let j = 0; j < dema.length; j++) {
    const sclPer1 = (j === 0 ? sclPer : sclPer * mul * emaPer[j - 1]);
    const demaJId = dema[j][id];
    const len = demaJId.length;

    let mu1 = new Array(len).fill(0);
    let sig1 = new Array(len).fill(0);

    const initialSlice = demaJId.slice(0, sclPer1);
    const initialMean = math.mean(initialSlice);
    const initialStd = math.std(initialSlice);

    mu1.fill(initialMean, 0, sclPer1);
    sig1.fill(initialStd, 0, sclPer1);

    for (let k = sclPer1; k < len; k++) {
        const slice = demaJId.slice(k - sclPer1 + 1, k + 1);
        mu1[k] = math.mean(slice);
        sig1[k] = math.std(slice);
    }

    dema[j][id] = math.dotDivide(math.subtract(demaJId, mu1), sig1);
}
*/


const compRet = () => {
  console.log('compRet per', srtPer);
  for (let id of coinId) {
    const l = coinPrc[id].prc.length;
    const i0 = coinPrc[id].prc.map(v => v>0).indexOf(true);
    if (l-srtPer>i0) {
      coinRet[id] = coinPrc[id].prc[l-1]/coinPrc[id].prc[l-1-srtPer];   // chg i1 i2
    } else {
      coinRet[id] = coinPrc[id].prc[l-1]/coinPrc[id].prc[i0]; 
    }
    /* if (id.includes('arc')) { console.log('00000000 arc 00000000 arc 00000000 arc 00000000 arc 00000000 arc ', id.slice(0, 8), 
      coinRet[id], 'l', l, 'i0', i0, 'prc', coinPrc[id].prc[l-1], coinPrc[id].prc[l-1-srtPer], coinPrc[id].prc[i0]);
      console.log('prc', coinPrc[id].prc);
    } */
  }
}


const compScorTrn = () => {
  for (let i=0; i<20; i++) {
    console.log('compScor');
  }
  //const lThr = 0, sThr = -2;
  for (let id of coinId) {
    const l = coinPrc[id].prc.length;
    let demaCnd = [dema[1][id][l-1]>0, dema[2][id][l-1]>0, dema[3][id][l-1]>0, dema[4][id][l-1]>0];
    //let dDemaCnd = [dDema[1][id][l-1]>0, dDema[2][id][l-1]>0, dDema[3][id][l-1]>0, dDema[4][id][l-1]>0];
    let dDemaCnd = [dDema[2][id][l-1]>0 || dDema[3][id][l-1]>0, dDema[4][id][l-1]>0];
    //coinScor[id] = math.divide(math.sum([...demaCnd, ...dDemaCnd].map(v => v ? 1 : -1)), 2);
    let demaScor = math.divide(math.sum(demaCnd.map(v => v ? 1 : -1)), 1);   // /2
    let dDemaScor = math.divide(math.sum(dDemaCnd.map(v => v ? 1 : -1)), 1); 
    coinScor[id] = demaScor+dDemaScor;   // /10;

    coinScorAll[id] = [];
    for (let j=0; j<l; j++) {
      demaCnd = [dema[1][id][j]>0, dema[2][id][j]>0, dema[3][id][j]>0, dema[4][id][j]>0];
      //dDemaCnd = [dDema[1][id][j]>0, dDema[2][id][j]>0, dDema[3][id][j]>0, dDema[4][id][j]>0];
      dDemaCnd = [dDema[2][id][j]>0 || dDema[3][id][j]>0, dDema[4][id][j]>0];
      demaScor = math.divide(math.sum(demaCnd.map(v => v ? 1 : -1)), 1);   // /2
      dDemaScor = math.divide(math.sum(dDemaCnd.map(v => v ? 1 : -1)), 1);
      coinScorAll[id][j] = demaScor+dDemaScor; 
    }
    //coinScorLst[id] = coinScorAll[id][l-1]+' '+coinScorAll[id][l-2];
    for (let j=l-1; j>0; j--) {
      if (coinScorAll[id][j]!=coinScorAll[id][j-1]) {
        /* const dat1 = (new Date(coinPrc[id].dat[j])).toUTCString();
        coinScorLst[id] = dat1.slice(17, 22)+' '+coinScorAll[j]+' '+coinScorAll[j-1];
        coinScorLst[id] = l.toString()+' j='+j.toString()+' '+coinScorAll[id][j]+' '+coinScorAll[id][j-1]; */
        const sgn = coinScorAll[id][j]>coinScorAll[id][j-1] ? '+' : '-';
        coinScorLst[id] = (l-j).toString()+sgn;
        break;
      }
    }  

    /* if (math.abs(dema[1][id][l-1])<1 && math.abs(dema[2][id][l-1])<1 && dema[3][id][l-1]>-1 && dema[4][id][l-1]>-1 && 
        dDema[1][id][l-1]>0 && dDema[2][id][l-1]>0 && dDema[3][id][l-1]>0 && dDema[4][id][l-1]>0) {
      coinScor[id] += 10;
      //console.log('coinScor', id, coinScor[id]);
    } */

    //const revCnd = [dema[1][id][l-1]<sThr, dema[2][id][l-1]<sThr, dema[3][id][l-1]>lThr, dema[4][id][l-1]>lThr]; 
    //coinScorRev[id] = math.sum(revCnd.map(v => v ? 1 : 0));
    /* coinScorRev[id] = {};
    coinScorRev[id].l = Math.max(dema[3][id][l-1], dema[4][id][l-1])-Math.min(dema[1][id][l-1], dema[2][id][l-1]);
    coinScorRev[id].s = Math.max(dema[1][id][l-1], dema[2][id][l-1])-Math.min(dema[3][id][l-1], dema[4][id][l-1]); */
  }
  //console.log('coinScorRev', coinScorRev);
}



const compScorBas = (s0, s1, s2, su, sd) => {
  let scor;
  if (s0 && s1 && s2) {
    scor = 5;
  } else if (!s0 && s1 && s2) {
    scor = 4;
  } else if (!s0 && s1 && !s2) {
    scor = 3;
  } else if (!s0 && !s1 && !s2) {
    scor = 2;
  } else if (s0 && !s1 && !s2) {
    scor = 1;
  } else if (s0 && !s1 && s2) {
    scor = 0;
  } else {
    scor = -1;
  }

  let sml;
  if (su) {   // add 0>4 + 1>5 + av scor0,1
    sml = .25;
  } else if (sd) {
    sml = -.25;
  } else {
    sml = 0;
  }
  scor += scor>1 ? sml : -sml;

  return scor;
}


const compScor = () => {   // add 6pt lr 4 (or 2 scor0,2)
  for (let i=0; i<20; i++) {
    console.log('compScor');
  }
  //const lThr = 0, sThr = -2;
  for (let id of coinId) {
    const l = coinPrc[id].prc.length;
    let s0 = dema[2][id][l-1]>0;
    let s1 = dema[4][id][l-1]>0;
    let s2 = ema[1][id][l-1]>ema[5][id][l-1];
    let su = (ema[3][id][l-1]>ema[3][id][l-2]) && (ema[3][id][l-2]>ema[3][id][l-3]); // && (ema[3][id][l-3]>ema[3][id][l-4]);
    let sd = (ema[3][id][l-1]<ema[3][id][l-2]) && (ema[3][id][l-2]<ema[3][id][l-3]); // && (ema[3][id][l-3]<ema[3][id][l-4]);
    /* if (s0 && s1 && s2) {
      coinScor[id] = 5;
    } else if (!s0 && s1 && s2) {
      coinScor[id] = 4;
    } else if (!s0 && s1 && !s2) {
      coinScor[id] = 3;
    } else if (!s0 && !s1 && !s2) {
      coinScor[id] = 2;
    } else if (s0 && !s1 && !s2) {
      coinScor[id] = 1;
    } else if (s0 && !s1 && s2) {
      coinScor[id] = 0;
    } else {
      coinScor[id] = -1;
    } */

    /* 1>3 3>5 1>5
    1 1 1   135   5
    0 1 1   315   4
    0 1 0   351   3
    0 0 0   531   2
    1 0 0   513   1
    1 0 1   153   0
    0 0 1   x
    1 1 0   x */

    /* let sml;
    if (su) {   // add 0>4 + 1>5 + av scor0,1
      sml = .25;
    } else if (sd) {
      sml = -.25;
    } else {
      sml = 0;
    }
    coinScor[id] += coinScor[id]>1 ? sml : -sml; */

    coinScor[id] = compScorBas(s0, s1, s2, su, sd);

    s0 = dema[1][id][l-1]>0;
    s1 = dema[3][id][l-1]>0;
    s2 = ema[0][id][l-1]>ema[4][id][l-1];
    su = (ema[2][id][l-1]>ema[2][id][l-2]) && (ema[2][id][l-2]>ema[2][id][l-3]); // && (ema[3][id][l-3]>ema[3][id][l-4]);
    sd = (ema[2][id][l-1]<ema[2][id][l-2]) && (ema[2][id][l-2]<ema[2][id][l-3]);

    coinScor0[id] = compScorBas(s0, s1, s2, su, sd);

    /* coinScorAll[id] = [];   // add s2
    for (let j=0; j<l; j++) {
      const s0 = dema[2][id][j]>0;
      const s1 = dema[4][id][j]>0;
      if (s0 && s1) {
        coinScorAll[id][j] = 3;
      } else if (!s0 && s1) {
        coinScorAll[id][j] = 2;
      } else if (!s0 && !s1) {
        coinScorAll[id][j] = 1;
      } else if (s0 && !s1) {
        coinScorAll[id][j] = 0;
      }
    } */

    coinScorAll[id] = [], coinScorAll0[id] = [];   // add VOL,   *** vol4h = SUM(vol1h) ***
    // plt vol / scor / vol+scor   add select btn   
    // in b0: pairs.volume = {"h24":2264972.51,"h6":380544.97,"h1":35744.25,"m5":2187.81}
    // also pairs.txns = {"m5":{"buys":6,"sells":7},"h1":{"buys":124,"sells":340},"h6":{"buys":1524,"sells":3136},"h24":{"buys":8355,"sells":11896}}
    for (let j=0; j<l; j++) {
      s0 = dema[2][id][j]>0;
      s1 = dema[4][id][j]>0;
      s2 = ema[1][id][j]>ema[5][id][j];
      coinScorAll[id][j] = compScorBas(s0, s1, s2, false, false);

      s0 = dema[1][id][j]>0;
      s1 = dema[3][id][j]>0;
      s2 = ema[0][id][j]>ema[4][id][j];
      coinScorAll0[id][j] = compScorBas(s0, s1, s2, false, false);
    }
      
    let coinScorLst1;
    for (let j=l-1; j>0; j--) {
      if (coinScorAll[id][j]!=coinScorAll[id][j-1]) {
        const sgn = coinScorAll[id][j]>coinScorAll[id][j-1] ? '+' : '-';
        coinScorLst[id] = (l-j).toString()+sgn;
        coinScorLst1 = l-j;
        break;
      }
    } 
    if (!coinScorLst[id]) {
      coinScorLst[id] = '99';
    }  

    //coinScor[id] += .1/coinScorLst1; 

    coinScorRev[id] = {};
    coinScorRev[id].l = Math.max(dema[3][id][l-1], dema[4][id][l-1])-Math.min(dema[1][id][l-1], dema[2][id][l-1]);
    coinScorRev[id].s = Math.max(dema[1][id][l-1], dema[2][id][l-1])-Math.min(dema[3][id][l-1], dema[4][id][l-1]);


    const prd = 10;
    //const prdEma = [ema[0][id].slice(j-prd, j+1), ema[1][id].slice(j-prd, j+1), ema[2][id].slice(j-prd, j+1)];
    const prdEma = [ema[0][id].slice(l-1-prd, l), ema[1][id].slice(l-1-prd, l), ema[2][id].slice(l-1-prd, l)];
    const prdTim0 = math.range(0,prd+1).toArray();
    const prdTim = math.multiply(math.transpose([[1, 1, 1]]), [prdTim0]);
    //let cond4a = true;
    const prc = coinPrc[id].prc;
    const nMin = (coinPrc[id].dat[l-1]-coinPrc[id].dat[l-2])/(1000*60);
    if (l>prd) {   // if (j>prd) {
      const prdSlp = lr_1slp(prdTim, prdEma);   // speedup   chk fewr # r<1  chg#ema
      //const prdRet = (1+prdSlp*prd/prc[j])**(1/prd);
      const prdRet = (1+prdSlp*prd/prc[l-1])**(1/prd);
      if (!prdSlp || !prdRet) {
        console.log('nanid', id, 'prdSlp', prdSlp, 'prc', prc[l-1], 'ema', ema[0][id][l-1], ema[1][id][l-1], ema[2][id][l-1]);
      }
      //console.log('prdRet id', id, 'j', j, prdRet);
      //cond4a = prdRet>1.0025;   //prm4a;
      
      if (prdSlp) {
        //const avPrc = math.mean(prc.slice(l-1-prd, l));
        const avPrc = ema[2][id][l-1]; 
        coinSlp[id] = (((1+prdSlp/avPrc)**(1440/nMin)-1)*100).toString().slice(0, 4);
        //coinSlp[id] = ((prdSlp/avPrc)*100).toString().slice(0, 4);
      } else {
        coinSlp[id] = -99;
      }
      //if (id=='sui') {
      //  console.log('prd prd prd prd prd', 'slp', prdSlp, 'ret', prdRet, 'nMin', nMin);
      //}
    } else {
      coinSlp[id] = -99;
    }
  }
}


const srt = () => {
  console.log('srt');
  const srtPer1 = document.getElementById('srtPer').value;
  if (srtPer1!=srtPer) {
    if (srtPer1>0 && srtPer1<maxStep) {
      srtPer = srtPer1;
      compRet();
      for (let i=0; i<plots.length; i++) {   // chg 4each
        const id = plots[i].coinId;
        console.log('srt id srt id srt id srt id srt id ', id);
        console.log('plots i', i, plots[i].layout.title);
        if (plots[i].layout.title.text.includes(' r=')) {
          /* if (id.includes('arc')) { console.log('22222222 arc 22222222 arc 22222222 arc 22222222 arc 22222222 arc ', id.slice(0, 8), coinRet[id]) } */
          const tit = coinSym[id]+' r='+coinRet[id].toString().slice(0, 5)+' s='+coinScor[id]+','+coinScor0[id]+'  '+coinScorLst[id]+'  f='+coinSlp[id];
          plots[i].layout.title.text = tit;
        }
      }
    } else {
      document.getElementById('srtPer').value = srtPer;
    }
  }
  //console.log('srt per', srtPer);

  //Plotly.react(plots[0].id, plots[10].data, plots[10].layout);

  //for (let i=0; i<plots.length; i++) {
  //  console.log('i b4', i, 'id', plots[i].id, plots[i].coinId);
  //}
  
  

  /* const r = [];
  for (let i=0; i<coinId.length; i++) {
    const id = coinId[i];
    r[i] = { id: id, ret: coinRet[id] };
  } */
  //const r = coinId.map(v => { return { id: v, ret: coinRet[v] }; });
  //const r = coinId.map(v => { return { id: v, ret: coinScor[v]+(coinRet[v]-1)/100 }; });
  //const r = coinId.map(v => { return { id: v, ret: coinScorRev[v].s }; });

  const srtFtr = document.getElementById('srtFtr').value;
  const srtDir = document.getElementById('srtDir').value;
  //console.log('srtFtr', srtFtr, 'srtDir', srtDir);
  
  let r;
  let coinScorLst1;
  if (srtFtr=='ret') {
    r = coinId.map(v => { return { id: v, ret: coinRet[v] }; });
  } else if (srtFtr=='slp') {
    r = coinId.map(v => { return { id: v, ret: Number(coinSlp[v]) }; });
  } else if (srtFtr=='scoRet') {
    r = coinId.map(v => { return { id: v, ret: coinScor[v]+(coinRet[v]-1)/1000 }; });
  } else if (srtFtr=='scoSlp') {
    r = coinId.map(v => { return { id: v, ret: coinScor[v]+Number(coinSlp[v])/1000 }; });
  } else if (srtFtr=='scoLst') {
    coinScorLst1 = {};
    console.log('coinScorLst'); coinId.forEach(v => { if (!coinScorLst[v]) { console.log(v, coinScorLst[v])} });
    coinId.forEach(v => { const m = coinScorLst[v].length; coinScorLst1[v] =  1/Number(coinScorLst[v].slice(0, m-1)); });
    r = coinId.map(v => { return { id: v, ret: coinScor[v]+(coinRet[v]-1)/1000+coinScorLst1[v]/10 }; });
  } else {
    console.log('srt err');
    return;
  }

  /* const alchId = coinId.find(v => v.includes('libra'));
  console.log('alchId alchId alchId alchId alchId ', alchId);
  console.log('scor', coinScor[alchId]);
  console.log('ret', coinRet[alchId]);
  //console.log('lst', coinScorLst1[alchId]);
  console.log('slp', coinSlp[alchId]);
  console.log('scor', coinScor[alchId], 'ret', (coinRet[alchId]-1)/1000, 'slp', Number(coinSlp[alchId])/1000);
  console.log('r', r.map(v => v.id).indexOf(alchId)); */

  if (srtDir=='+') {
    r.sort((a, b) => -a.ret+b.ret); 
  } else {
    r.sort((a, b) => a.ret-b.ret); 
  }
  //console.log('rsort', r.map(v => v.id).indexOf(alchId));
  
  /* for (let i=0; i<100; i++) {
    console.log('rsort i', i, r[i].ret);
  }
  for (let i of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 80, 81, 82, 83, 84]) {
    const id1 = r[i].id;
    console.log(id1, r[i].ret, 'scor', coinScor[id1], 'ret', (coinRet[id1]-1)/1000, 'slp', Number(coinSlp[id1])/1000);
  } */

  const rId = r.map(v => v.id);
  //console.log('rId len', rId.length, rId.slice(0, 10));
  rId.forEach((v, i) => coinNum[v] = i);
  //console.log('rId rId rId rId rId rId rId rId rId rId ', rId.indexOf(alchId), coinNum[alchId]);
  //console.log('coinNum', coinNum);

  iCoin0 = 0;
  displayPlots(true);
  //window.scrollTo(0, 0);

  return

  
  plotSrt = [];
  const plotsDc = plots.map(item => JSON.parse(JSON.stringify(item)));   // deepcopy
  console.log('plots len', plots.length, plotsDc.length);
  plotsId = [];
  for (let id of rId) {
    let ex = false;
    for (let i=0; i<plots.length; i++) {
      if (plots[i].coinId==id) {
        plotSrt.push(plotsDc[i]);
        ex = true;
      }
    }
    if (ex) {
      plotsId.push(id);
    }
  }
  console.log('plotsId len', plotsId.length, plotsId.slice(0, 10));
  console.log('plots len', plots.length, plots.slice(0, 10));
  console.log('plotSrt len', plotSrt.length, plotSrt.slice(0, 10));

  for (let i=0; i<plots.length; i++) {
    //console.log('i af', i, 'id', plots[i].id, plots[i].coinId);
    plotSrt[i].id = plots[i].id;
    //console.log('i af2', i, 'id', plots[i].id, plots[i].coinId);
  }

  //for (let i=0; i<plots.length; i++) {
  ////  plotSrt[i].id = plots[i].id;
  //  console.log('plotSrt i', i, 'id', plotSrt[i].id, plotSrt[i].coinId)
  //}

  //for (let i=0; i<plots.length; i++) {
  //  console.log('i sr', i, 'id', plotSrt[i].id, plotSrt[i].coinId);
  //}

  //for (let i=0; i<plotSrt.length; i++) {
  //  Plotly.react(plotSrt[i].id, plotSrt[i].data, plotSrt[i].layout);
  //}

  for (let iCoin=iCoin0; iCoin<iCoin0+nCoinPg; iCoin++) {
    for (let iRow=0; iRow<2; iRow++) {
      for (let iCol=0; iCol<3; iCol++) {
        const pltId = `i${iCoin}r${iRow}${iCol}`;
        const plotSrt1 = plotSrt.find(v => v.id==pltId);
        Plotly.react(plotSrt1.id, plotSrt1.data, plotSrt1.layout);
      }
    }
  }

  return






  /* console.log('srt 0', plots[0]);
  for (let i=0; i<plots.length; i++) {
    const id = plots[i].coinId;
    const iCoin = rId.indexOf(id);
    plots[i].srtId = Math.ceil(Math.random()*100000);
    //iCoin.toString().padStart(2, '0')+plots[i].srtId.slice(2);
  }
  console.log('srt 1', plots[0]);
  plots.sort((a, b) => a.srtId-b.srtId);
  console.log('srt 2', plots[0]); */

    /* plotsContainer.innerHTML = '';
    plots.forEach(({ id }) => {
        const plotDiv = document.createElement('div');   // add irow icol
        plotDiv.id = id;
        plotDiv.className = 'plot';
        plotsContainer.appendChild(plotDiv);
        observer.observe(plotDiv); 
    }); */

    //plots.forEach(plot => {
    //  Plotly.react(plot.id, plot.data, plot.layout);   // have to recreate html
    //});


  /* gpt
    function permutePlotIDs() {
    // Example permutation logic (you can customize this)
    let permutedPlots = plots.sort(() => Math.random() - 0.5);

    // Update each plot with the new data and layout
    permutedPlots.forEach(plot => {
        Plotly.react(plot.id, plot.data, plot.layout);
    });
  } */

  /* document.querySelectorAll('.plot').forEach(plot => {
    if (plot.id!='') {
      const plotDiv = document.getElementById(plot.id);
      plotDiv.style.width = `${width}px`;
      plotDiv.style.height = `${height}px`;
      Plotly.relayout(plot.id);
    }
  }); */



  /* const coinRet = {};
  

  for (let iCoin=0; iCoin<nCoin; iCoin++) {
    const id = coinId[iCoin];
    for (let iRow=0; iRow<2; iRow++) {
      for (let iCol=0; iCol<3; iCol++) {
        pltId = `i${iCoin}r${iRow}${iCol}`;
        const j = plots.map(v => v.id).indexOf(pltId);
        plots[j].r = coinRet[id];
      }
    }
  }
  console.log('b4', plots.slice(0, 5).map(v => v.id));
  plots.sort((a, b) => a.r - b.r); 
  console.log('af', plots.slice(0, 5).map(v => v.id));

  //plots.forEach(plot => {
  //  Plotly.newPlot(plot.id, plot.data, plot.layout);   // react
  //});

  plotsContainer.innerHTML = '';
  plots.forEach(({ id }) => {
    if (id!='') {
      const i0 = id.indexOf('i');
      const i1 = id.indexOf('r');
      const iCoin = id.slice(i0+1, i1);
      const iRow = id.slice(i1+1, i1+2);
      const iCol = id.slice(i1+2, i1+3);
      //console.log('id', id, iCoin, iRow, iCol);  
    }
  }); */



/* replot according to virtscrt.html
     plots.forEach(({ id }) => {
        const plotDiv = document.createElement('div');
        plotDiv.id = id;
        plotDiv.className = 'plot';
        container.appendChild(plotDiv);
        observer.observe(plotDiv);
    }); */
}


const fmtTs = (t, sep) => {
  const date = new Date(t);  
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getUTCDate()).padStart(2, '0');
  //const year = String(date.getUTCFullYear()).slice(-2); // Get last two digits of the year
  const year = String(date.getUTCFullYear()); // Get last two digits of the year
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');  
  let d;
  if (sep==0) {
    d = `${month}${day}${year} ${hours}${minutes}`;
  } else if (sep==1) {
    d = `${month}-${day}-${year} ${hours}:${minutes}`;
  } else {
    d= `${year}-${month}-${day} ${hours}:${minutes}:00`;
  }
  return d+'Z';
}


const nxtn = (n) => {
  const prc = coinPrc[id].prc;
  const l = prc.length;
  const r = [];
  for (let i=0; i<l-n; i++) {
    r[i] = math.mean(prc.slice(i+1, i+n+1))/prc[i];
  }
  for (let i=l-n; i<l; i++) {
    r[i] = r[l-n-1];  
  }
  return r;
}


const lr = (x, Y) => {
  const n = x[0].length;
  const XT = [Array(n).fill(1), ...x]; 
  const X = math.transpose(XT);
  const XTX = math.multiply(XT, X);
  const d = math.eigs(XTX).values;
  const rd = math.min(d)/math.max(d);
  //console.log('d', math.min(d), math.max(d), rd);
  if (rd<1e-8) {
    console.log('lr rd', rd);
    return [];
  }
  const XTX_inv = math.inv(XTX);
  const XTY = math.multiply(XT, Y);
  const ab = math.multiply(XTX_inv, XTY);
  const b = ab[0];
  const a = ab.slice(1);
  return [a, b];
}


