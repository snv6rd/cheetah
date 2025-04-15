console.log('prdFn');
const prdPer = [12, 13, 14, 15, 16];

const fgh = () => { 
  console.log('compPrd');     
  const nPrd = 12; 
  const phi = [[], [], [], []];   // dema[2 4]
  const nxt = []; 
  const l = coinPrc[idRef].prc.length;
  console.log('l', l);

  for (let id of coinId) {
    const i0 = coinPrc[id].prc.map(v => v>0).indexOf(true);
    if (i0<10 && id==idRef) {
      //console.log('id', id, 'y', math.size(phi[0]), math.size(phi[1]), math.size(nxt));
      phi[0].push(...dema[2][id].slice(i0, l-nPrd));
      phi[1].push(...dDema[2][id].slice(i0, l-nPrd));
      phi[2].push(...dema[4][id].slice(i0, l-nPrd));
      phi[3].push(...dDema[4][id].slice(i0, l-nPrd));
      //console.log('phi0', math.size(phi[0]), math.size(phi[1]));
      
      const prc = coinPrc[id].prc;

      let ret = [];
      for (let i=i0+1; i<l; i++) {
        ret[i] = prc[i]/prc[i-1]-1; 
      }
      const nxt1 = [];
      for (let i=i0; i<l-nPrd; i++) {
        nxt1.push(math.mean(ret.slice(i+1, i+nPrd+1)));
      }
      //console.log('phi0', math.size(dema[2][id].slice(i0, l-nPrd)), 'nxt1', math.size(nxt1));


      let ret1 = prc.slice(i0+1).map((v, i) => v/prc[i0+i]-1);   
      const mu = math.mean(ret1);
      const sig = math.std(ret1);
      ret1 = math.dotDivide(math.subtract(ret1, mu), sig);
      //const d = math.subtract(ret.slice(i0+1), ret1);
      //const di = d.map(v => v!=0).indexOf(true);
      //console.log('ret-ret1', di, ret.slice(i0+1)[di], ret1[di]);
      //console.log('ret-ret1', math.max(math.abs(math.subtract(ret.slice(i0+1), ret1))), ret.slice(i0+1).length, ret1.length);
      
      ret1 = [ret1[0], ...ret1];
      const nxt2 = ret1.slice(0,l-nPrd-i0).map((_, i) => math.mean(ret1.slice(i+1, i+nPrd+1))); 
      //console.log('nxt2', math.size(nxt2), math.max(math.abs(math.subtract(nxt1, nxt2))));
      
      //const nxt1 = prc.slice(i0, l-nPrd).map((v, i) => math.mean(ret.slice(i0+i+1, i0+i+nPrd+1)));

      /* const nxt1 = [];
      for (let i=i0; i<l-nPrd; i++) {
        nxt1.push(math.mean(prc.slice(i+1, i+nPrd+1))/prc[i]);
      } */
      const nxt3 = prc.slice(i0, l-nPrd).map((v, i) => math.mean(prc.slice(i0+i+1, i0+i+nPrd+1))/v);
      
      /* console.log('nxt1 len', nxt1.length, 'nxt2 len', nxt2.length);
      let d = 0;
      for (let i=0; i<nxt1.length; i++) {
        d = Math.max(d, Math.abs(nxt1[i]-nxt2[i]));
      }
      console.log('d', d); */
      nxt.push(...nxt3);
    } else {
        //console.log('id', id, 'n');
    }
  }
  console.log('phi siz', math.size(phi), 'nxt siz', math.size(nxt), nxt.slice(0,10));

  const thr = 3.;
  for (let i=0; i<phi.length; i++) {
    for (let j=0; j<phi[i].length; j++) {
      if (phi[i][j]>thr) {
        phi[i][j] = thr;
      } else if (phi[i][j]<-thr) {
        phi[i][j] = -thr;
      }
    }
  }
  for (let j=0; j<nxt.length; j++) {
    if (nxt[j]-1>.05) {
      nxt[j] = 1.05;
    } else if (nxt[j]-1<-.05) {
      nxt[j] = 1-.05
    }
  }

  let [aa, bb] = lr(phi, nxt);   
  console.log('aa', aa, 'bb', bb);
  const nxt1 = math.add(math.multiply(aa, phi), bb); 
  console.log('nxt1 siz', math.size(nxt1), nxt1.slice(0, 10)); 
  return

  const ddall = [], nxtall = [];
  for (let id of coinId) {
    const i0 = coinPrc[id].prc.map(v => v>0).indexOf(true);
    for (let i=i0; i<l; i++) {
      const x = [dema[2][id][i], dDema[2][id][i], dema[4][id][i], dDema[4][id][i]];
      ddall.push(x);
      nxtall.push(nxtRet[id][i]);
    }
  }
  console.log('ddall siz', math.size(ddall), ddall.slice(0, 5));
  console.log('nxtall siz', math.size(nxtall), nxtall.slice(0, 5));
  const k = 3;

  //let cntr = 0;
  const ti = (new Date()).toUTCString();
  for (let id of coinId) {   
    console.log('prd id', id, '/', coinId.length); 
    nxtRet1[id] = [];
    const i0 = coinPrc[id].prc.map(v => v>0).indexOf(true);
    for (let i=i0; i<l; i++) {
      const x = [dema[2][id][i], dDema[2][id][i], dema[4][id][i], dDema[4][id][i]];
      //nxtRet1[id][i] = math.add(math.multiply(aa, x), bb);

      // for (let j=0; j<ddall.length; j++) {
      //  if (ddall[j][0]==x[0] && ddall[j][1]==x[1] && ddall[j][2]==x[2] && ddall[j][3]==x[3]) {
      //    console.log(id, i, j, ddall[j], x);
      //    break
      //  }
      //} 
      const d = ddall.map(v => math.sum(math.abs(math.subtract(v, x))));
      const di = math.range(0, d.length).toArray(); 
      const imin = di.sort((a, b) => d[a]-d[b]).slice(0, k); 
      const dmin = imin.map(v => d[v]);
      //console.log('dmin', id, i, imin, dmin);

      //const imin = x .map((el, idx) => ({ idx, distance: Math.hypot(...el.map((val, i) => val - z[i])), })).reduce((closest, current) => current.distance < closest.distance ? current : closest ).idx;

      nxtRet1[id][i] = nxtall[imin[1]];
      
      if (i%500==0) {
        console.log('i', id, i, '/', l, 'dmin', imin, dmin);
      }
      //if (i>i0+1000) { break }
    }
    
    //cntr++;
    //if (cntr>0) {
    //  break;
    //}
  } 
  const tf = (new Date()).toUTCString();
  console.log('dun', 'ti', ti, 'tf', tf);   // n=21 3hr 
}