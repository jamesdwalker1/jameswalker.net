// type = note | worksheet
module.exports = function configureAce(type, manualReloadCallback) {
    let editor = ace.edit("markup");
    editor.setTheme("ace/theme/textmate");
    editor.getSession().setMode("ace/mode/asciidoc"); // Works best for now - TODO: create a mode
    editor.getSession().setUseWrapMode(true);
    editor.setShowPrintMargin(false);
    editor.setFontSize(16);
    editor.renderer.setShowGutter(false);
    editor.$blockScrolling = Infinity;

    editor.commands.addCommand({
        name: 'bold',
        bindKey: {
            win: 'Ctrl-B',
            mac: 'Command-B'
        },
        exec: function (editor) {
            editor.insert('[b]');
        },
        readOnly: true
    });
    editor.commands.addCommand({
        name: 'finish bold',
        bindKey: {
            win: 'Ctrl-Shift-B',
            mac: 'Command-Shift-B'
        },
        exec: function (editor) {
            editor.insert('[/b]');
        },
        readOnly: true
    });
    editor.commands.addCommand({
        name: 'italics',
        bindKey: {
            win: 'Ctrl-I',
            mac: 'Command-I'
        },
        exec: function (editor) {
            editor.insert('[i]');
        },
        readOnly: true
    });
    editor.commands.addCommand({
        name: 'finish italics',
        bindKey: {
            win: 'Ctrl-Shift-I',
            mac: 'Command-Shift-I'
        },
        exec: function (editor) {
            editor.insert('[/i]');
        },
        readOnly: true
    });
    editor.commands.addCommand({
        name: 'equation',
        bindKey: {
            win: 'Ctrl-M|Alt-=', // Alt-= is the shortcut for MS word
            mac: 'Command-E'
        },
        exec: function (editor) {
            editor.insert('[e]');
        },
        readOnly: true
    });
    editor.commands.addCommand({
        name: 'finish equation',
        bindKey: {
            win: 'Ctrl-Shift-M|Ctrl-Alt-=|Shift-Alt-=',
            mac: 'Command-Shift-E'
        },
        exec: function (editor) {
            editor.insert('[/e]');
        },
        readOnly: true
    });
    editor.commands.addCommand({
        name: 'line break',
        bindKey: {
            win: 'Shift-Enter',
            mac: 'Shift-Enter'
        },
        exec: function (editor) {
            editor.insert('[newline]\n');
        },
        readOnly: true
    });
    editor.commands.addCommand({
        name: 'reload',
        bindKey: {
            win: 'Ctrl-Space|Ctrl-Enter',
            mac: 'Command-Space|Command-Enter'
        },
        exec: manualReloadCallback,
        readOnly: true
    });

    let completedChecker;

    // Type = 'img' or 'ms' (notes can only have images, resources have mark schemes too)
    function addImage(editor, type) {
        editor.insert(`[${type} `);
        clearInterval(completedChecker);
        localStorage.setItem('uploadName', '');
        window.open('#/upload/', '_blank');

        completedChecker = setInterval(function () {
            const uploadName = localStorage.getItem('uploadName');
            if (uploadName === '') {
                return; // user hasn't uploaded yet
            }

            editor.insert(uploadName + ']');
            clearInterval(completedChecker);        
        }, 250);
    }

    editor.commands.addCommand({
            name: 'upload image',
            bindKey: {
                win: 'Ctrl-I',
                mac: 'Command-I'
            },
            exec: function (editor) {
                addImage(editor, 'img');
            }
        });

    if (type === 'worksheet') {
        editor.commands.addCommand({
            name: 'add mark scheme',
            bindKey: {
                win: 'Ctrl-M',
                mac: 'Command-M'
            },
            exec: function (editor) {
                addImage(editor, 'ms');
            }
        });
    }

    return editor;
}