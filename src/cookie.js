/*
	Esta biblioteca depende da Base64, JSON2 e _$over
*/
(function(window, document, Base64, _$over){

var cookie_001 = function(name, value, tempo){
	this.cookie  = value; // default {}
	this.name = name;
	this.tempo = tempo;
};

// pega o cookie le deserializa e seta
cookie_001.prototype.get = _$over({
    'String':function(name){
        this.name = name;
        this.cookie = this.ler();
        return this;
    },
    '':function(){
        this.cookie = this.ler();
        return this;
    }
})
// escreve o cookie no formato raw
cookie_001.prototype._write = function(name, value, days){
	// por default, não existe expiração, ou seja o cookie é temporario
	var expires = "";
	
	// Especifica o número de dias para guardar o cookie
	
	if(days){
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 *  1000));
		expires = "; expires="+ date.toGMTString();
	}
	
	if(value != "" && value != null && value != "null"){
		// Define o cookie com o nome, valor e a data de expiração
		document.cookie = name + "=" + value + expires + "; path=/";
	}
}

// le o cookie e traz no formato raw
cookie_001.prototype._read = function (name){
	// Encontra o cookie especificado e retorna o seu valor
	var searchName = name + "=";
	var cookies = document.cookie.split('; ');
	for(var i=0;i<cookies.length; i++){
	
		var c = cookies[i];
		if(c.indexOf(searchName) == 0){
			return c.substring(searchName.length, c.length);
		}

	}
	
	return null;
}

// exclui o cookie
cookie_001.prototype._erase = function(name){
	// Excluio cookie
	this._write(name, "", -1);
}

// salva o cookie fazendo todo o procedimento de serialização 
cookie_001.prototype.salvar = function(){
	if(typeof this.cookie == 'object'){
		this._write(this.name, Base64.encode(JSON.stringify(this.cookie)), this.tempo);
	}else{
		this._write(this.name, Base64.encode(this.cookie)), this.tempo;
	}
}

// set o valor do cookie e salva
cookie_001.prototype.set = function(value){
	this.cookie = value;
    this.salvar();
}

// adiciona um item ao cookie se ele for um array
cookie_001.prototype.add = function(obj){
	if(typeof this.cookie == "object"){
		if(this.cookie.push){
			this.cookie.push(obj);
			this.salvar();
		}
	}else{
		return "Desculpe seu cookie não é um array";
	}
}

cookie_001.prototype.deletar = function(){
	this._erase(this.name);
}


// lê o cookie e faz todo o processo de deserialização
cookie_001.prototype.index = function(index){
	if(typeof this.cookie == 'object'){
		return this.cookie[index];
	}
}
cookie_001.prototype.ler = _$over({
	'':function(){
		return this.ler(this.name);
	},
	'String':function(name){
		var str = Base64.decode(this._read(name));
		if(str){
			if(str[0] == '[' || str[0] == '{'){
				return JSON.parse(str);
			}
			return str;
		}
		this.salvar();
		return this.cookie;
	}
	
});

// construtor
window.Cookie = _$over({
    'String':function(name){
        var s = new cookie_001(name, [], "");
        s.get();
        s.salvar();
        return s;
    },
    'Object':function(st){
        if(st.name && st.value && st.time){
            var s = new cookie_001(st.name, st.value, st.time);
            s.salvar();
            return s;
        }
        else if(st.name && st.value){
            var s = new cookie_001(st.name, st.value, "");
            s.salvar();
            return s;
        }
        else if(st.name){            
            var s = new cookie_001(st.name, [], "");
            s.get();
            return s;
        }
    }
});

})(window, document, Base64, _$over);
