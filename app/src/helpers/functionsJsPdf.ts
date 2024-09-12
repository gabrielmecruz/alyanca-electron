function vazia(v: any) {
  if (v.constructor === Date)
    return false;
  //Função: Retornar true quando "v" não conter valor
  return (v == undefined || v == null ||
    (v.constructor === String && v.trim() == '') ||
    (isArray(v) && v.length <= 0 && v.keysCount <= 0) ||
    (isObject(v) && v.keysCount <= 0));
}

function pos(busca: any, txt: any, start: any = 0) {
  var ret: any = -1,
    c, hits = 0;
  txt = (txt != undefined ? txt : '');
  if (((isArray(busca)) || (busca != '')) &&
    ((isArray(txt)) || (!vazia(txt)))) {
    start = (vazia(start) ? 0 : Math.max(0, parseInt(start)));
    if (isArray(busca)) {
      for (c = 0; c < busca.length; c++) {
        ret = pos(busca[c], txt, start);
        if (ret >= start) break;
      }
    }
    else if (isArray(txt)) {
      for (c = start; c < txt.length; c++) {
        ret = (busca == txt[c] ? c : -1);
        if (ret >= start) break;
      }
    } else if (isObject(txt) && txt.type == 'store') {
      //quando for store
      for (var x in txt.data.items) {
        for (var i in txt.data.items[x].data) {
          if ((!vazia(txt.data.items[x].data[i])) &&
            (txt.data.items[x].data[i] == busca)) {
            ret = i;
            break;
          }
        }
        if (ret >= 0) break;
      }
    } else {
      txt = ((txt.constructor == String) ? txt : txt.toString());
      if (!String.prototype.indexOf) {
        for (c = start; c < txt.length; c++) {
          if (busca[hits] == txt[c]) {
            hits++;
          } else if (hits == busca.length) {
            ret = (c - hits) + 1;
            break;
          } else {
            hits = 0;
          }
        }
      } else {
        ret = txt.indexOf(busca, start);
      }
    }
  }
  return ret;
}

function substr(txt: any, pi: any, tam: any = 0) {
  var ret = '', c;
  if (!vazia(txt)) {
    txt = (txt.constructor == String ? txt : txt.toString());
    if (pi < txt.length) {
      if (!String.prototype.substr) {
        for (c = pi; c < txt.length; c++) {
          ret += txt[c];
          if ((!vazia(tam)) && (ret.length == tam)) {
            break;
          }
        }
      } else {
        if (vazia(tam) || tam == 0) {
          ret = txt.substr(pi);
        } else {
          ret = txt.substr(pi, tam);
        }
      }
    }
  }
  return ret;
}

function isObject(mixed: any) {
  return (mixed != undefined
    && mixed != null
    && mixed.constructor !== Array
    && mixed.constructor !== String
    && mixed.constructor !== Number
    && mixed.constructor !== Boolean
    && (typeof (mixed) === 'object' || mixed.constructor === Object));
}

function isArray(mixed: any) {
  return (
    (mixed != undefined) &&
    (mixed != null) &&
    mixed.constructor !== Object &&
    mixed.constructor !== String &&
    mixed.constructor !== Number &&
    mixed.constructor !== Boolean &&
    mixed.constructor === Array
  );
}

export function replace(from: any, to: any, txt: any, withRegEx: any = true) {
  txt = txt.toString();
  if (isArray(from)) {
    var toIsArr = isArray(to),
      c;
    for (c in from) {
      txt = replace(from[c], toIsArr ? to[Math.min(c as any, to.length - 1)] : to, txt, withRegEx);
    }
  } else {
    var re,
      c,
      repl = function (de: any, para: any, texto: any) {
        var p = -1;
        while (de !== para && (p = pos(de, texto)) && p >= 0) {
          texto = substr(texto, 0, p) + para + substr(texto, p + de.length);
        }
        return texto;
      };
    withRegEx = withRegEx == undefined || withRegEx == null || withRegEx == "" ? true : withRegEx;
    if (!withRegEx || !String.prototype.replace) {
      txt = repl(from, to, txt);
    } else {
      try {
        if (from == ".") {
          re = new RegExp("\\.", "g");
        } else if (from == "\\") {
          re = new RegExp("\\" + from, "g");
        } else {
          re = new RegExp(from, "g");
        }
        txt = txt.replace(re, to);
      } catch (e) {
        txt = repl(from, to, txt);
      }
    }
  }

  return txt;
}