import style from './index.css';
import theme from './prismjs-theme-vscode.css';

import Prism from 'prismjs';

export default class Codeblock {
  constructor({ data, api }) {
    this.data = {
      code: data.code || '',
      language: data.language || '',
    };

    // this.highlight =

    this.id = 'id' + Math.random().toString(16).slice(2);
    this.wrapper = undefined;
  }

  static get toolbox() {
    return {
      title: 'Codeblock',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8L5 12L9 16"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 8L19 12L15 16"></path></svg>',
    };
  }

  static get enableLineBreaks() {
    return true;
  }

  _updateCode(value) {
    const element = document.getElementById('code-' + this.id);
    element.innerHTML = value;

    Prism.highlightElement(element);
  }

  _updateLanguage(value) {
    const editor = document.getElementById('editor-' + this.id);
    const pre = document.getElementById('pre-' + this.id);
    const code = document.getElementById('code-' + this.id);
    const lang = document.getElementById('lang-'+ this.id);
    
    // Remove current language class
    let classToRemove = '';

    pre.classList.forEach((c) => {
      if (c.includes('language-')) {
        classToRemove = c;
      }
    });

    pre.classList.remove(classToRemove);
    code.classList.remove(classToRemove);

    // Add new language class
    pre.classList.add('language-' + value);

    // update lang
    lang.innerHTML = value;

    // Update code
    this._updateCode(editor.value);
  }

  renderSettings() {
    const settingsContainer = document.createElement('div');
    const select = document.createElement('select');

    select.classList.add('cdx-input');
    select.addEventListener('change', (e) => {
      this._updateLanguage(e.target.value);
    });

    //sort available languages alphabetically (ignore case)
    const languages = Object.keys(Prism.languages).sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    languages.map((lang) => {
      if (lang == 'extend' || lang == 'insertBefore' || lang == 'DFS') {
        return;
      }

      const option = document.createElement('option');

      option.value = lang;
      option.text = lang;

      if (lang == this.data.language) {
        option.selected = 'selected';
      }

      select.appendChild(option);
    });

    const wrapper = document.createElement('div');

    wrapper.appendChild(select);

    return wrapper;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('ce-code__wrapper');

    // Textarea
    const editor = document.createElement('textarea');
    editor.id = 'editor-' + this.id;
    editor.classList.add('ce-code__textarea');
    editor.textContent = this.data.code;

    // language
    const lang = document.createElement('div');
    lang.id = 'lang-' + this.id;
    lang.classList.add('ce-code__language');
    lang.innerHTML = this.data.language;

    // Preview
    const preview = document.createElement('pre');
    const code = document.createElement('code');
    const highlighted = Prism.highlight(this.data.code, Prism.languages.css);

    preview.id = 'pre-' + this.id;
    preview.classList.add('line-numbers');
    preview.classList.add('language-' + this.data.language);

    code.id = 'code-' + this.id;
    code.innerHTML = highlighted;

    preview.appendChild(code);

    // Events
    editor.addEventListener('input', (e) => {
      this._updateCode(e.target.value);
    });

    // Final
    Prism.highlightElement(code);
    this.wrapper.appendChild(editor);
    this.wrapper.appendChild(preview);
    this.wrapper.appendChild(lang);

    console.log(Prism.languages);

    return this.wrapper;
  }

  save(block) {
    return {
      code: block.value,
    };
  }
}
