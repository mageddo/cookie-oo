/**
 * Nome: Cookie
 * Url: https://github.com/mageddo/CookieOO/
 * Desenvolvedor: Elvis de Freitas http://mageddo.com - contato@mageddo.com ( por favor mandar seus agradecimentos e reclamações)
 * Descrição: Gerencia cookies de forma abstrata e genérica facilitando a implementação
 * Versão: 0.0.3
 * Dependencias:
 *  Base64 - http://www.webtoolkit.info/javascript-base64.html
 *  _$over - https://github.com/myfingersarebroken/simpleOverload
 */
(function(window, document, Base64, _$over) {

    var cookie_001 = function(name, value, tempo) {
        this.cookie = value; // default []
        this.name = name;
        this.tempo = tempo;
    };

    /**
     * Se name for setado procura um cookie com o nome setado o le seta no objeto atual e também o retorna 
     * caso nao le o cookie com o nome do atual e seta o valor no objeto
     * @param {String} name
     * pega o cookie lê deserializa e seta
     */
    cookie_001.prototype.get = _$over({
        'String': function(name) {
            this.name = name;
            this.cookie = this.read();
            return this;
        },
        '': function() {
            this.cookie = this.read();
            return this;
        }
    })
    /**
     *  Escreve o cookie no formato raw
     *  @param {String} name
     *  @param {String} value
     *  @param {String}{Number} days
     **/
    cookie_001.prototype._write = function(name, value, days) {
        // por default, não existe expiração, ou seja o cookie é temporario
        var expires = "";

        // Especifica o número de dias para guardar o cookie

        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }

        if (value != "" && value != null && value != "null") {
            // Define o cookie com o nome, valor e a data de expiração
            document.cookie = name + "=" + value + expires + "; path=/";
        }
    }

    /**
     * lê o cookie e traz no formato raw
     * @param {type} name
     * @returns {String}
     */
    cookie_001.prototype._read = function(name) {
        // Encontra o cookie especificado e retorna o seu valor
        var searchName = name + "=";
        var cookies = document.cookie.split('; ');
        for (var i = 0; i < cookies.length; i++) {

            var c = cookies[i];
            if (c.indexOf(searchName) == 0) {
                return c.substring(searchName.length, c.length);
            }

        }

        return null;
    }

    /**
     * Exclui o cookie
     * @param {type} name
     *
     */
    cookie_001.prototype._erase = function(name) {
        // Excluio cookie
        this._write(name, "", -1);
    }

    /**
     * Salva o cookie atual fazendo todo o procedimento de serialização 
     * 
     */
    cookie_001.prototype.save = function() {
        if (typeof this.cookie == 'object') {
            this._write(this.name, Base64.encode(JSON.stringify(this.cookie)), this.tempo);
        } else {
            this._write(this.name, Base64.encode(this.cookie)), this.tempo;
        }
    }

    /**
     * Seta o valor do cookie e salva
     * @param {type} value
     */
    cookie_001.prototype.set = function(value) {
        this.cookie = value;
        this.save();
    }

    /**
     * Adiciona um item ao cookie se ele for um array
     * @param {All} obj
     * @returns {String}
     */
    cookie_001.prototype.add = function(obj) {
        if (typeof this.cookie == "object") {
            if (this.cookie.push) {
                this.cookie.push(obj);
                this.save();
            }
        } else {
            return "Desculpe seu cookie não é um array";
        }
    }



    /**
     * Deleta o cookie atual
     */
    cookie_001.prototype.delete = function(key) {
        delete this.cookie[key];
        this.save();
        return true;
    }
    /**
     * Deleta o cookie atual
     */
    cookie_001.prototype.deleteCookie = function() {
        this._erase(this.name);
    }

/**
 * Verifica se o cookie está prenchido
 * @return {Boolean}
 */
    cookie_001.prototype.isEmpty = function() {
        var val = this.read();
        if(val){
            if(typeof val == 'object'){
                if(Array.isArray(val)){
                    if(val.length){
                        return true
                    }
                    return false;
                }else{
                    var n=0;
                    for(var k in val){
                        n++;
                    }
                    if(n>=1)return true;else return false;
                }
            }else{
                if(val.length && (val == 'null' || val == 'undefined')){
                    return false;
                }
                else if(val.length){
                    return true;
                }
                return false;
            }
        }else{
            return false;
        }
    }

    /**
     * Traz o índice oo propriedade do cookie caso ele seja um Object
     * @param {String, Number} index
     * @returns {All}
     */
    cookie_001.prototype.index = function(index) {
        if (typeof this.cookie == 'object') {
            return this.cookie[index];
        }
    }

    /**
     * Traz contéudo do conteúdo do cookie, se @param name naão for setado retorna o conteúdo do próprio
     * @param {String} name 
     * @returns {All}
     */
    cookie_001.prototype.read = _$over({
        '': function() {
            return this.read(this.name);
        },
        'String': function(name) {
            var str = this._read(name);
            if (str) {
                str = Base64.decode(str);
                if (str[0] == '[' || str[0] == '{') {
                    return JSON.parse(str);
                }
                return str;
            }
            this.save();
            return this.cookie;
        }

    });

    /**
     * Construtor
     */
    window.Cookie = _$over({
        /**
         * @param {String} name
         */
        'String': function(name) {
            var s = new cookie_001(name, [], "");
            s.get();
            s.save();
            return s;
        },
        /**
         * @param {Object} st (Settings)
         * st
         *   st.name - nome do cookie
         *   st.value - valor do cookie
         *   st.time - tempo de vida do cookie
         */
        'Object': function(st) {
            if (st.name && st.value && st.time) {
                var s = new cookie_001(st.name, st.value, st.time);
                s.save();
                return s;
            }
            else if (st.name && st.value) {
                var s = new cookie_001(st.name, st.value, "");
                s.save();
                return s;
            }
            else if (st.name) {
                var s = new cookie_001(st.name, [], "");
                s.get();
                return s;
            }
        }
    });

})(window, document, Base64, _$over);
