// index.js, go-jq.js

module.exports = (function () {

//---------------------
const v = {

    typ: require ('go-typ').res,
    goMsg: require ('go-msg'),
    doMsg: null,

    msgTypes: {

        primary: {
                // void tags
            area: 0, base: 0, br: 0, col: 0, embed: 0, hr: 0, img: 0, input: 0, keygen: 0, link: 0, meta: 0, param: 0, source: 0, track: 0, wbr: 0, 

                // non-void tags
            a: 1, abbr: 1, address: 1, article: 1, aside: 1, audio: 1, b: 1, bdi: 1, bdo: 1, blockquote: 1, body: 1, button: 1, canvas: 1, caption: 1, cite: 1, code: 1, colgroup: 1, datalist: 1, dd: 1, del: 1, details: 1, dfn: 1, dialog: 1, div: 1, dl: 1, dt: 1, em: 1, fieldset: 1, figcaption: 1, figure: 1, footer: 1, form: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, head: 1, header: 1, hgroup: 1, html: 1, i: 1, iframe: 1, ins: 1, kbd: 1, label: 1, legend: 1, li: 1, map: 1, mark: 1, menu: 1, meter: 1, nav: 1, noscript: 1, object: 1, ol: 1, optgroup: 1, option: 1, output: 1, p: 1, pre: 1, progress: 1, q: 1, rp: 1, rt: 1, ruby: 1, s: 1, samp: 1, script: 1, section: 1, select: 1, small: 1, span: 1, strong: 1, style: 1, sub: 1, summary: 1, sup: 1, svg: 1, table: 1, tbody: 1, td: 1, textarea: 1, tfoot: 1, th: 1, thead: 1, time: 1, title: 1, tr: 1, u: 1, ul: 1, 'var': 1, video: 1,
        },

        secondary: {
            style: 1,
            title: 1,
        },
            // elements that can be either a primary tag itself or an attribute of another primary tag
            // if any other primary tags is present, then secondary tags are treated as
            // attributes of the other primary tag

        meta: {
            sel: 1,
                // sel => add events to existing selector
                // presumes there is no primary key (else would
                // be adding a new element, not modifying existing)
            empty: 1, rm: 1, 
            prepend: 1, append: 1, before: 1, after: 1, parent: 1,
            attr: 1, content: 1, text: 1, 
            clk: 1, dclk: 1, hin: 1, hot: 1, sbt:1, gox: 1,
                // define click, double-click, hoverIn, hoverOut and submit callbacks
            evt:1,
                // local evt ctrl => overrides v.evtIsOn status
        },

    },


};


const A = {};

//---------------------
A.init = () => {

    window.$ = P.jQ;

    v.doMsg = new v.goMsg (v.msgTypes).parseMsg;

}; // end A.init

const f = {};

//---------------------
f.dispatch = (sel, fName, cb) => {
    
    if (cb) {

        f.doJqOp (sel, fName, cb);

    } else {

//        const ev = new Event (fName);
//        elsO [0].dispatchEvent (ev);  => creates unTrusted Event
// https://stackoverflow.com/questions/6577865/focus-event-with-dispatchevent
    

        const el = sel.elsO [0];
        el [fName] ();

    } // end if (cb)
    
    return sel;

}; // end f.dispatch 


//---------------------
f.doJqOp = (sel, fName, newEl_cb, eventType_className_value) => {

        // ----  newNode ----
    const newNode = function (p) {
        // p: {isText, elS, attrAA, content, meta}

        let newElO;

        if (p.isText) {

            newElO = document.createTextNode (p.elS);

        } else {

            newElO = document.createElement (p.elS);
            const ob = $(newElO);

            if (p.content) {

                ob.append (p.content);

            } // end if (p.content)
            
            ob.attr (p.attrAA);

            if (p.meta) {

                const metaKeysA = Object.keys (p.meta);
                metaKeysA.forEach (function (key) {

                    switch (key) {

                        case 'clk':
                            ob.click (p.meta.clk);
                            break;


                    } // end switch (key)
                    
                });

            } // end if (p.meta)
            

        } // end if (isText)

        return newElO;

    };  // end newNode 


       // ---- main ----

    const elsO = sel.elsO;
    let newNodeP = {
         isText: null,
         elS: null,
         attrAA: null,
         content: null,
         meta: null,
    };

    let newElO;
    let cb;

    const typ = v.typ (newEl_cb);
    switch (typ) {

        case 'arr':

            newEl_cb.forEach (function (nel) {

                f.doJqOp (sel, fName, nel, eventType_className_value);
            });

            return;
            break;

        case 'obj':

            if (newEl_cb.hasOwnProperty ('elsO')) {

                newElO = newEl_cb.elsO;

            } else if (newEl_cb.hasOwnProperty ('nodeType')) {

                // TODO??? newElO = [newEl_cb];
                newElO = newEl_cb;

            } else if (fName === 'tooltip') {

                newElO = null;

            } else {

                const pp = v.doMsg (newEl_cb);
                let isText = false;
                let elS = null;

                if (pp.p ) {

                    elS = pp.p;

                } else if (pp.m.text) {

                    elS = pp.m.text;
                    isText = true;

                } // end if (pp.p )
                

                newNodeP = {
                    isText,
                    elS,
                    attrAA: Object.entries (pp.s),
                    content: pp.c,
                    meta: pp.m,
                };

                newElO = newNode (newNodeP);
//                if (newEl_cb.hasOwnProperty ('data-bs-toggle') && newEl_cb ['data-bs-toggle'] === 'tooltip') {
//
//                    new bootstrap.Tooltip (newElO);
//
//                } // end if (newEl_cb.hasOwnProperty ('data-bs-toggle') && newEl_cb ['data-bs-toggle'] === 'tooltip')
                
                // TODO pp.m, meta properties

            } // end if (newEl.hasOwnProperty ('elsO'))
            
            break;

        case 'fun':
            cb = newEl_cb;
            break;

        default: newEl_cb = JSON.stringify (newEl_cb);
        case 'str':

            const parsedO = f.parseDomString (newEl_cb);

            newElO = newNode (parsedO);
    
            break;

        case 'nul':
            // do nothing
            break;



    } // end switch (typ.res)
    
//    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
//
//    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
//        return new bootstrap.Tooltip(tooltipTriggerEl)
//    })

    const values = [];
    let res = sel;

    elsO.forEach (function (elO) {

        switch (fName) {

            case 'addClass':

                elO.classList.add (eventType_className_value);
                break;

            case 'removeClass':

                elO.classList.remove (eventType_className_value);
                break;

            case 'insertBefore':
                elO.parentNode.insertBefore (newElO, elO);
                break;

            case 'insertAfter':
                elO.parentNode.insertBefore (newElO, elO.nextSibling);
                break;

            case 'lastChild':
                values.push (elO.lastChild);
                break;

            case 'removeLastChild':
                elO.removeChild (elO.lastChild);
                break;

//            case 'remove':
//            case 'blur':
//            case 'focus':
//                elO[fName] ();
//                break;

            case 'empty':
                elO.innerHTML = "";
                break;

            case 'remove':
            case 'blur':
            case 'focus':
            case 'keydown':
            case 'input':
            case 'mouseenter':
            case 'mouseleave':
            case 'click':
            case 'submit':
            case 'touchstart':
            case 'touchend':
                elO.addEventListener (fName, cb);
                break;

            case 'serialize':
                values.push (elO.serialize ());
                break;

            case 'on':
                elO.addEventListener (eventType_className_value, cb);
                break;

            case 'off':
                elO.removeEventListener (eventType_className_value, cb);
                break;

            case 'append':
            case 'prepend':

                elO[fName] (newElO);
                break;

            case 'tooltip':

                const tooltip = f.doTooltip (elO, newEl_cb);
                values.push (tooltip);
                break;

            case 'val':

                if (typeof eventType_className_value !== 'undefined') {

                    elO.value = eventType_className_value;

                } // end if (typeof eventType_className_value === 'undefined')
                values.push (elO.value);

                break;

            default:
                console.log (`f.doJqOp: default not expected. fName = ${fName}`);
                break;

        } // end switch (fName)

    });

    if (values.length > 0) {

        res = values.length === 1 ? values [0] : values;

    } // end if (values.length > 0)
    
    return res;

}; // end f.doJqOp 


//---------------------
f.doTooltip = (elO, tipO) => {
    
    let res;
    tipO.title = tipO.title ? tipO.title : "no title provided";

    op.attr ([elO], 'data-bs-toggle', 'tooltip');

    res = new bootstrap.Tooltip (elO, tipO);
    return res;

}; // end f.doTooltip 


//---------------------
f.getProp = (elsO, prop) => {
    
    const props = [];
    elsO.forEach (function (el) {

        const style = getComputedStyle (el);
        const val = style.getPropertyValue (prop);
        props.push (val);

    });

    const res = props.length === 1 ? props [0] : props;
    return res;

}; // end f.getProp 


//---------------------
f.parseDomString = (newEl) => {
    
        // ----  parseAttr ----
    const parseAttr = function (attrSS) {
        const res = {};
        const attrSA = attrSS.split (/\s+/);
        attrSA.forEach (function (attrS) {

            const mt = attrS.match (/([^=]+)=\s*['"]([^'"]+)/);
            res [[mt [1]]] = mt [2];
        });

        return res;
    };  // end parseAttr 


       // ---- main ----
    let isText = false;
    let elS;
    let attrAA = [];
    let content;

    const mtA = newEl.match (/^<([^ >]+)([ >])([\s\S+]*)/);
        // 1: elmt
        // 2: space or > (if '>', NO attributes present)
        // 3: remaining string

    if (mtA) {
        // true => string represents html
        // false => raw text

        elS = mtA [1];
        const sep = mtA [2];
        let rem = mtA [3];  // rem: a) or b)

        if (! (sep === '>')) {  // a) '>' immediately adjacent to element name

            const mtB = rem.match (/([^>]+)>([\s\S]*)/);
                // 1: string containing attrubute defs -- attr = val
                // 2: remaining, after closing '>'

            attrAA = parseAttr (mtB[1]);

            rem = mtB [2];

        } // end if (sep === '>')

        // now, rem is after first closing '>', so includes any optional content and optional closing tag (for non-void tags)

        const mtC = rem.match (/([\s\S]*)<[^<]+$/);
            // 1: optional content (child) of parent element

        if (mtC) {

            content = mtC [1];

        } else {

            content = "";

        } // end if (mtC)
        
    } else {

        isText = true;
        elS = newEl;
        attrAA = [];
        content = null;

    } // end if (mtA)

    return {isText, elS, attrAA, content};

};  // end parseDomString 

//---------------------
f.setProps = (elsO, entries) => {
    
    elsO.forEach (function (el) {

        entries.forEach (function (entry) {

            const prop = entry [0];
            const val = entry [1];

            el.style [prop] = val;
        });
    });

}; // end f.setProps 


const op = {};

//---------------------
op.attr = (sel, attr0, attrName) => {
    
    const elsO = sel.elsO;

    let keyVals = null;
    let res = null;

    switch (v.typ (attr0)) {

        case 'arr':
            if (attr0.length === 0) {

                return null;

            } else if (Array.isArray (attr0 [0])) {

                keyVals = attr0;

            } else {

                keyVals = [attr0];

            } // end if (Array.isArray (attr0 [0]))
            
            break;

        case 'obj':
            keyVals = Object.entries (attr0);
            break;

        case 'str':
            if (attrName) {

                keyVals = [[attr0, attrName]];

            } // end if (attrName)
                // if attrName is undef or null, keyVals will remain null
            break;
            

    } // end switch (v.typ (attr0))
    
    if (keyVals) {
        elsO.forEach (function (el) {
            keyVals.forEach (function (keyVal) {
                el.setAttribute (keyVal [0], keyVal [1]);
            });
        });

    } else {

        res = elsO [0].getAttribute (attr0);

    } // end if (keyVals)
    
    return res;

}; // end op.attr 


//---------------------
op.css = (sel, prop, value) => {
    
    const elsO = sel.elsO;

    let res = null;

    if (typeof prop === 'object') {

        f.setProps (elsO, Object.entries (prop));

    } else if (typeof value === 'undefined') {

        res = f.getProp (elsO, prop);

    } else {

        f.setProps (elsO, [[prop, value]]);

    } // end if (typeof prop === object)

    return res;

}; // end op.css 


//---------------------
op.offset = (sel) => {
    
    const elsO = sel.elsO;
    const offsetA = [];

    elsO.forEach (function (elO) {

        offsetA.push ({
            offsetTop: elO.offsetTop,
            offsetLeft: elO.offsetLeft,
            offsetHeight: elO.offsetHeight,
            offsetWidth: elO.offsetWidth,
        });

    });

    return offsetA;

}; // end op.offset 


//---------------------
op.submit = (sel, cb) => {
    
    return f.dispatch (sel, 'submit', (ev) => {
        
        ev.preventDefault ();

        const res = {};
        const fElements = elsO [0].elements;
        const keys = Object.keys (fElements);
        keys.forEach (function (key) {
            if (key === "0") { return; }
            
            const val = fElements [key].value;
            res [key] = val;   
        });

        cb (res);
    });

    return sel;

}; // end op.submit


const P = {};

//---------------------
P.jQ = function (tgt) {
    
    const sel = {
        elsO: null,

        ready: (cb) => {
            window.onload = () => {
                cb ();
            };
        },

        css: (prop, value) => {
            const css = op.css (sel, prop, value);
            return css ? css : sel;
        },

        addClass: (className) => {
            return f.doJqOp (sel, 'addClass', null, className);
        },

        removeClass: (className) => {
            return f.doJqOp (sel, 'removeClass', null, className);
        },

        hasClass: (className) => {
            const el = sel.elsO [0];
            const re = new RegExp (className);

            const res = re.test (el.className);
            return res;
        },

        append: (newEl) => {
            if (newEl === null) { return; }
            return f.doJqOp (sel, 'append', newEl); 
        },

        prepend: (newEl) => {
            return f.doJqOp (sel, 'prepend', newEl); 
        },

        before: (newEl) => {
            return f.doJqOp (sel, 'insertBefore', newEl); 
        },
        after: (newEl) => {
            return f.doJqOp (sel, 'insertAfter', newEl);  // will use insertBefore on sibling
        },

        empty: () => {
            return f.doJqOp (sel, 'empty', null);
        },
        remove: () => {
            return f.doJqOp (sel, 'remove', null);
        },

        blur: () => {
            return f.doJqOp (sel, 'blur', null);
        },

//        focus: () => {
//            return f.doJqOp (sel, 'focus', null);
//        },
//
        focus: (cb) => {
            return f.dispatch (sel, 'focus', cb);
        },

        attr: (attr0, attrName) => {

            const attr = op.attr (sel, attr0, attrName);
            return attr ? attr : sel;
            
        },

        on: (eventType_className_value, cb) => {
            return f.doJqOp (sel, 'on', cb, eventType_className_value);
        },

        off: (eventType_className_value, cb) => {
            return f.doJqOp (sel, 'off', cb, eventType_className_value);
        },

        keydown: (cb) => {
            return f.dispatch (sel, 'keydown', cb);
        },

        click: (cb) => {
            return f.dispatch (sel, 'click', cb);
        },

        input: (cb) => {
            return f.dispatch (sel, 'input', cb);
        },

        mouseenter: (cb) => {
            return f.dispatch (sel, 'mouseenter', cb);
        },

        mouseleave: (cb) => {
            return f.dispatch (sel, 'mouseleave', cb);
        },

        lastChild: () => {
            return f.doJqOp (sel, 'lastChild', null);
        },

        removeLastChild: () => {
            return f.doJqOp (sel, 'removeLastChild', null);
        },

        submit: (cb) => {
            op.submit (sel, cb);
            return sel;
        },

        serialize: () => {
            return f.doJqOp (sel, 'serialize', null);
        },

        tooltip: (tipO) => {
            return f.doJqOp (sel, 'tooltip', tipO);
        },

        touchend: (cb) => {
            return f.dispatch (sel, 'touchend', cb);
        },

        touchstart: (cb) => {
            return f.dispatch (sel, 'touchstart', cb);
        },

        offset: () => {
            const offsetA = op.offset (sel);
            return offsetA;
        },
        val: (value) => {
            return f.doJqOp (sel, 'val', null, value);
        },

    };  // lcl this

    switch (v.typ (tgt)) {

        case 'arr':
            sel.elsO = tgt;
            break;

        case 'obj':

            if (tgt.hasOwnProperty ('elsO')) {

                sel.elsO = tgt.elsO;

            } else {

                sel.elsO = [tgt];

            } // end if (tgt.hasOwnProperty ('elsO'))
            
            break;

        case 'str':

            sel.elsO = document.querySelectorAll (tgt);
            break;

    } // end switch
    
    return sel;

}; // end P.jQ 

A.init();

return P;

})();

