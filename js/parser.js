/*
    TODO: multithreading/run on seperate thread

	Uses caching for 5-10x performance in editor
*/

let Parser = function () {
    this.markup = '';
    this.chunks = [];
    this.previousChunks = [];
    this.currentlyRunning = false;
	this.texMode = false;
};

Parser.prototype._chunk = function () {
    const chunks = this.markup.split('__');

    let chunkObjs = [];

    for (let i = 0; i < chunks.length; i++) {
        chunkObjs.push({
            chunkId: i,
            markup: chunks[i],
            html: ''
        });
    }

    this.chunks = chunkObjs;
};

Parser.prototype.setMarkup = function (markup) {
    this.markup = markup;
    this.previousChunks = this.chunks;

	const texMode = markup.substring(0, 50).indexOf('<allowtex>') > -1;
	if (texMode !== this.texMode) {
		this.clearCache();
	}
	this.texMode = texMode;

    this._chunk();
};

Parser.prototype.clearCache = function () {
	this.previousChunks = [];
};

Parser.prototype.toHTML = function (callback) {
    this.currentlyRunning = true;

    let html = '';
    const self = this;

    this.chunks.forEach(function (chunk) {
        self.previousChunks.forEach(function (oldChunk) {
            if (oldChunk.markup === chunk.markup) {
                chunk.html = oldChunk.html;
            }
        });

        // If not already cached
        if (chunk.html === '') {
            chunk.html = self._parse(chunk.markup);
        }

        html += chunk.html + '</ul><hr>'; // add __ divider back in (was removed in the split)
    });

    callback(html);
};

Parser.prototype._parse = function (markup) {
	// Flashcard references
	const lines = markup.split(/\r?\n/);
	let adjustedMarkup = '';

	lines.forEach(function (line) {
		if (line[0] === '[' && line[line.length - 1] === ')') {
			// e.g. line = [[m]a[/m] title](AB)(AC)(AD) 
			let subtitle = line.split('](')[0];
			return adjustedMarkup += subtitle + ']';
		}

		adjustedMarkup += line;
	});

	// Allow ^ if not using TeX
	if (!this.texMode) {
		// (deprecated) old img TeX (service deprecated by Google with no replacement)
		// Must be done before ^ replacement as ^ is used in TeX
		adjustedMarkup = adjustedMarkup
			.replace(/\[texline\](.+?)\[\/texline\]/g, function (match, capture) {
				return '<img src="https://chart.googleapis.com/chart?cht=tx&chf=bg,s,0000FF00&chco=B20000&chs=80&chl=' +
					encodeURIComponent(capture) + '" alt="" class="tex" height="16">'
			})
			.replace(/\[tex\](.+?)\[\/tex\]/g, function (match, capture) {
				return '<img src="https://chart.googleapis.com/chart?cht=tx&chf=bg,s,0000FF00&chco=B20000&chs=175&chl=' +
					encodeURIComponent(capture) + '" alt="" class="tex" height="35">'
			})

			.replace(/\^(.)/g, '<sup>$1</sup>');
	}

    return adjustedMarkup

		// Title [t][/t]
		.replace(/\[t\]/g, '</ul><h1>')
        .replace(/\[\/t\]/g, '</h1><hr><ul>')

		// Bullets -- --- ---
		.replace(/----/g, '<br>&nbsp;&nbsp; - ')
		.replace(/---/g, '<br> - ')
		.replace(/--/g, '<li>')

		// Bold, italics, underline [b/i/u][/b/i/u]
		.replace(/\[b\](.+?)\[\/b\]/g, '<strong>$1</strong>')
		.replace(/\[i\](.+?)\[\/i\]/g, '<em>$1</em>')
		.replace(/\[u\](.+?)\[\/u\]/g, '<span style="text-decoration:underline">$1</span>')

		// Images [img https://example.com/img.png], [img https://example.com/img.png 300w] (number indicates max width)
		.replace(/\[img ([^ ]+?)\]/g, '<img src="$1" alt="">')
		.replace(/\[img (.+?) (.+?)w\]/g, '<img src="$1" alt="" width="$2" style="max-width:$2">')

		// Dividers __
		.replace(/__/g, '</ul><hr>')

		// New lines [newline]
		.replace(/\[newline\]/g, '<br>')

		// Colours [blue/red/green/grey][/blue/red/green/grey]
		.replace(/\[blue\](.+?)\[\/blue\]/g, '<span style="color: blue">$1</span>')
		.replace(/\[red\](.+?)\[\/red\]/g, '<span style="color: #B20000">$1</span>')
		.replace(/\[green\](.+?)\[\/green\]/g, '<span style="color: green">$1</span>')
		.replace(/\[gray\](.+?)\[\/gray\]/g, '<span style="color: gray">$1</span>')

		// Todo, marker [todo][/todo], [m/marker][/m/marker]
		.replace(/\[todo\](.+?)\[\/todo\]/g, '<div class="todo"><strong>TO DO: $1</strong></div>')
		.replace(/\[marker](.+?)\[\/marker\]/g, '<strong class="marker" id="$1">$1</strong> ')
		.replace(/\[m](.+?)\[\/m\]/g, '<strong class="marker" id="$1">$1</strong> ')

		// Symbols
		.replace(/\[->\]/g, '<span>&#8594;</span>')
		.replace(/\[>=\]/g, '<span>&ge;</span>')
		.replace(/\[<=\]/g, '<span>&le;</span>')
		.replace(/\[divide\]/g, '<span>&divide;</span>')
		.replace(/\[plusorminus\]/g, '<span>&plusmn;</span>')
		.replace(/\[Delta\]/g, '<span>&Delta;</span>')
		.replace(/\[half\]/g, '<span>&frac12;</span>')
		.replace(/\[sqrt\]/g, '<span>&radic;</span>')
		.replace(/\[sigma\]/g, '<span>&sigma;</span>')
		.replace(/\[Sigma\]/g, '<span>&sum;</span>')
		.replace(/\[sum\]/g, '<span>&sum;</span>')
		.replace(/\[deg\]/g, '<span>&deg;</span>')
		.replace(/\[pi\]/g, '<span>&pi;</span>')
		.replace(/\[x\]/g, '&times;')
		.replace(/\[symbol html=(.+?)\]/g, '$1') // used in old site - kept for compatibility with old markup

		// (deprecated, used in old site) non TeX fractions
		.replace(/frac=(.+?)\/(.+?)=frac/g, '<sup>$1</sup><em>/</em><sub>$2</sub>')

		// (deprecated, used in old site) single-line (non TeX) equations
		.replace(/\[equation\]/g, '<code>')
		.replace(/\[\/equation\]/g, '</code>')

		// TeX equations - inline
		.replace(/\[e\]/g, '££')
		.replace(/\[\/e\]/g, '££')

		.replace(/\[eblock\]/g, '€€')
		.replace(/\[\/eblock\]/g, '€€')

		// Subscript [sub][/sub] or ` and Superscript [sup][/sup]
		.replace(/\`(.)/g, '<sub>$1</sub>')
		.replace(/\[sub\](.+?)\[\/sub\]/g, '<sub>$1</sub>')
		.replace(/\[sup\](.+?)\[\/sup\]/g, '<sup>$1</sup>')

		// Subtitles aka <h2> [subtitle text here]
		.replace(/\[/g, '</ul><h2>')
		.replace(/\]/g, ':</h2><ul>')

		// Clear params
		.replace(/\<allowtex\>/g, '');
}

module.exports = Parser;