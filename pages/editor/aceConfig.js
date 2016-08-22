module.exports = function configureAce() {
    let editor = ace.edit("markup");
    editor.setTheme("ace/theme/textmate");
    editor.getSession().setMode("ace/mode/asciidoc"); // Works best for now - TODO: create a mode
    editor.getSession().setUseWrapMode(true);
    editor.setShowPrintMargin(false);
    editor.setFontSize(15);
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

    return editor;
}