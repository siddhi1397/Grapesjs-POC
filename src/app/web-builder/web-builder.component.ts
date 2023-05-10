import { Component, OnInit } from '@angular/core';
import grapesjs from 'grapesjs';
import 'grapesjs-preset-webpage';
import 'grapesjs-blocks-basic';
import 'grapesjs-plugin-ckeditor';
import plugin from 'grapesjs-tui-image-editor';
import '@silexlabs/grapesjs-fonts';
import juice from 'juice';
@Component({
  selector: 'app-web-builder',
  templateUrl: './web-builder.component.html',
  styleUrls: ['./web-builder.component.scss'],
})
export class WebBuilderComponent implements OnInit {
  public editor: any;
  model: any;
  entityName: string = '';
  showStyle: boolean = false;
  constructor() {}

  ngOnInit(): void {
    // const css = '.gjs-hovered {border-top-width: 0; border-bottom-width: 0;border-left-width: 0;border-right-width: 0;border-bottom-style: none;border-top-style: none;border-left-style: none;border-right-style: none;border-bottom-color: transparent;border-top-color: transparent;border-left-color: transparent;border-right-color: transparent;border-image-outset: unset;border-image-source: none;border-image-slice: unset;border-image-width: unset;border-image-repeat: unset; }';
    this.initEditor();
    this.componentSelect();
    const css = '.gjs-badge {display: none !important;}';
    this.editor.setStyle(css);

    this.editor.on('component:deselected', (args: any) => {
      this.showStyle = false;
      if (args.attributes.type === 'text') {
        let divArea: any = document
          .querySelector('iframe')
          ?.contentWindow?.document?.getElementById(args.ccid)?.children;
        if (divArea?.length > 0) {
          for (let i = 0; i < divArea!.length; i++) {
            divArea[i].setAttribute('id', `p${i}`);
            if (divArea![i].children.length > 0) {
              let block = '';
              for (let j = 0; j < divArea![i].children!.length; j++) {
                if(divArea[i].children[j].children.length > 0) {
                  console.log(divArea[i].children[j].children[0].outerHTML);
                  let innerText = divArea[i].children[j].children[0].innerText.trim().split(' ');
                  if(innerText.length === 1) {
                    block += divArea[i].children[j].outerHTML;
                  }
                }
                else if (divArea![i].children[j].getAttribute('class')) {
                  const span = document.createElement('span');
                  span.innerHTML = divArea![i].children[j].innerText;
                  span.setAttribute('id', `entity${i}-${j}-${args.ccid}`);
                  span.setAttribute('contenteditable', 'false');
                  span.setAttribute(
                    'style',
                    'color: #00adc5; border: 1px solid; padding: 3px;pointer-events: none;cursor: not-allowed;'
                  );
                  span.setAttribute(
                    'class',
                    divArea![i].children[j].getAttribute('class')
                  );
                  block += span.outerHTML;
                  // block += divArea![i].children[j].outerHTML;
                } else {
                  let spanText = divArea![i].children[j].innerText.split(' ');
                  const outerHTML = divArea[i].children[j].outerHTML.toString();
                  spanText?.forEach((el: any, index: number) => {
                    if (el.trim()) {
                      let e = `<span id="block${i}${j}-${index}-${args.ccid}"> ${el} </span>`;
                      block += e;
                    }
                  });
                }
              }
              divArea![i].innerHTML = block;
            } else {
              let paraText = divArea![i].innerText?.split(' ');
              divArea![i].innerHTML = '';
              paraText?.forEach((el: any, index: number) => {
                let e = `<span id="block${i}-${index}-${args.ccid}"> ${el} </span>`;
                divArea![i].innerHTML += e;
              });
            }
          }

          for (let j = 0; j < divArea.length; j++) {
            let dividedSpan = divArea[j].children;
            for (let i = 0; i < dividedSpan!.length; i++) {
              let spanTag = document
                .querySelector('iframe')
                ?.contentWindow?.document.getElementById(dividedSpan![i].id);

              if(!spanTag?.className) {
                spanTag?.addEventListener('dragover', (e: any) => {
                  e.preventDefault();
                });
                spanTag?.addEventListener('drop', (e: any) => {
                  var el = document
                    .querySelector('iframe')
                    ?.contentWindow?.document.getElementById(e.target.id);
                  let span = this.createElement(e);
                  let htmlText = new DOMParser().parseFromString(
                    span.outerHTML,
                    'text/html'
                  );
                  el?.parentNode?.insertBefore(
                    htmlText.body.childNodes[0],
                    el.nextSibling
                  );
                });
              }
             
            }
          }
        }
      }
    });
    document
      .querySelector('.drag-entity')
      ?.addEventListener('dragstart', (e: any) => {
        e.dataTransfer.setData(
          'custom',
          e.target.id + ',' + e.target.innerHTML
        );
      });

    this.addVideoBlock();
  }

  initEditor() {
    this.editor = grapesjs.init({
      container: '#gjs',
      fromElement: true,
      height: '300px',
      width: 'auto',
      storageManager: {
        type: 'custom',
        autoload: true,
        autosave: true,
        stepsBeforeSave: 1,
      },
      blockManager: {
        appendTo: '#blocks',
        blocks: [],
      },
      dragMode: 'absolute',
      canvas: {},
      showDevices: false,
      styleManager: {
        appendTo: '#style-container',
        sectors: [
          {
            name: 'Styles',
            open: false,
            buildProps: [
              'border-radius-c',
              'background-color',
              'background',
              'border',
            ],
          },
        ],
      },
      layerManager: {},
      traitManager: {},
      plugins: [
        'gjs-blocks-basic',
        plugin,
        'grapesjs-plugin-ckeditor',
        // 'grapesjs-preset-webpage',
      ],
      pluginsOpts: {
        'gjs-blocks-basic': {
          blocks: ['text', 'image', 'video'],
        },
        plugin: {
          config: {
            includeUI: {
              initMenu: 'filter',
            },
          },
        },
        'grapesjs-preset-webpage': {},
        'grapesjs-plugin-ckeditor': {
          position: 'left',
          options: {
            // contentsCss: '/../../../../assets/contents.css',
            extraPlugins:
              'sharedspace,justify,colorbutton,panelbutton,justify,font,floatpanel,panel,openlink,richcombo,mentions,xml,autocomplete,textmatch,textwatcher,ajax',
            removeDialogTabs: 'image:advanced;link:advanced',
            allowedContent: true,
            toolbar: [
              [
                'Bold',
                'Italic',
                'Underline',
                'EmojiPanel',
                'Format',
                'JustifyLeft',
                'JustifyCenter',
                'JustifyRight',
              ],
              { name: 'links', items: ['Link', 'OpenLink'] },
              { name: 'colors', items: ['TextColor'] },
              { name: 'paragraph', items: ['NumberedList', 'BulletedList'] },
              { name: 'styles', items: ['Font', 'FontSize'] },
              { name: 'Merge Fields', items: ['strinsert'] },
            ],
            mentions: [
              {
                feed: this.dataFeed,
                itemTemplate:
                  '<li data-id="{id}">' +
                  '<strong class="username">{username}</strong>' +
                  '<span class="fullname">{fullname}</span>' +
                  '</li>',
                outputTemplate: '<span class="entity-class">@{username}</span>',
                minChars: 0,
              },
            ],
            strinsert_strings: [
              { value: '*|FIRSTNAME|*', name: 'First name' },
              { value: '*|LASTNAME|*', name: 'Last name' },
              { value: '*|INVITEURL|*', name: 'Activate invite URL' },
            ],
            // Optionally add the below settings
            strinsert_button_label: 'Merge Fields',
            strinsert_button_title: 'Insert Merge Field',
          },
        },
      },
    });
    this.editor.Panels.removeButton('views', 'open-layers');
    this.editor.Panels.removeButton('views', 'open-sm');
    this.editor.Panels.removeButton('views', 'open-blocks');
    this.editor.Panels.removeButton('views', 'open-tm');
    this.editor.Panels.removeButton('options', 'export-template');
    this.editor.Panels.removeButton('options', 'fullscreen');
    this.editor.StorageManager.add('custom', {
      load: (keys: any, clb: any) => {
        this.editor.setComponents(localStorage.getItem('submitData'));
      },
      store: function (data: any, clb: any, opts: any) {
        localStorage.setItem(
          'submitData',
          String(
            document
              .querySelector('iframe')
              ?.contentWindow?.document.getElementsByTagName('body')[0]
              .innerHTML
          )
        );
      },
    });
  }

  componentSelect() {
    this.editor.on('component:selected', (args: any) => {
      this.showStyle = true;
      if (args.attributes.type === 'wrapper') {
        args.attributes.resizable = false;
        args.attributes.toolbar = [];
      } else {
        args.attributes.toolbar = [
          {
            attributes: {
              class: 'gjs-no-touch-actions',
              draggable: true,
            },
            command: 'tlb-move',
            label:
              '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z"/></svg>',
          },
          {
            command: 'tlb-clone',
            label:
              '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" /></svg>',
          },
          {
            command: 'tlb-delete',
            label:
              '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>',
          },
        ];
      }
    });
  }

  addVideoBlock() {
    this.editor.on('component:create', (model: any) => {
      if (model.get('type') === 'video' || model.get('type') === 'audio') {
        this.editor.runCommand('open-assets', {
          target: model,
        });
        this.editor.Modal.open({
          title: 'Select Audio/Video',
        });
        document.getElementsByClassName('gjs-btn-prim')[0].innerHTML = 'Add';
      }
    });

    this.editor.Blocks.get('video').set({
      label: 'Audio/Video',
      attributes: {
        class: '',
      },
      content: {
        ...this.editor.editor.Blocks.get('video').attributes.content,
        style: {
          width: '250px',
          height: '200px',
        },
      },
      media: `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" id="upload"><path d="M18,9h-2c-0.6,0-1,0.4-1,1s0.4,1,1,1h2c0.6,0,1,0.4,1,1v7c0,0.6-0.4,1-1,1H6c-0.6,0-1-0.4-1-1v-7c0-0.6,0.4-1,1-1h2
      c0.6,0,1-0.4,1-1S8.6,9,8,9H6c-1.7,0-3,1.3-3,3v7c0,1.7,1.3,3,3,3h12c1.7,0,3-1.3,3-3v-7C21,10.3,19.7,9,18,9z M9.7,6.7L11,5.4V17
      c0,0.6,0.4,1,1,1h0c0.6,0,1-0.4,1-1V5.4l1.3,1.3C14.5,6.9,14.7,7,15,7c0.3,0,0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4l-3-3c0,0,0,0,0,0
      c-0.4-0.4-1-0.4-1.4,0l-3,3c-0.4,0.4-0.4,1,0,1.4C8.7,7.1,9.3,7.1,9.7,6.7z"></path></svg>`,
    });
  }

  createElement(e: any) {
    const uniqueId = Math.random().toString(36).slice(2);
    const span = document.createElement('span');
    span.innerHTML =
      'u' + String(e.dataTransfer.getData('custom')).split(',')[1];
    span.setAttribute(
      'id',
      String(e.dataTransfer.getData('custom')).split(',')[0] + '-' + uniqueId
    );
    span.setAttribute('contenteditable', 'false');
    span.setAttribute(
      'style',
      'color: #00adc5; border: 1px solid; padding: 3px;pointer-events: none;cursor: not-allowed;'
    );
    span.setAttribute(
      'class',
      String(e.dataTransfer.getData('custom')).split(',')[0]
    );
    return span;
  }

  submit() {
    localStorage.setItem(
      'submitData',
      String(
        document
          .querySelector('iframe')
          ?.contentWindow?.document.getElementsByTagName('body')[0].innerHTML
      )
    );
  }

  dataFeed(opts: any, callback: any) {
    const entityList: any = [
      {
        id: 1,
        avatar: 'm_1',
        fullname: 'Charles Flores',
        username: 'cflores',
      },
      {
        id: 2,
        avatar: 'm_2',
        fullname: 'Gerald Jackson',
        username: 'gjackson',
      },
      {
        id: 3,
        avatar: 'm_3',
        fullname: 'Wayne Reed',
        username: 'wreed',
      },
    ];
    let matchProperty: any = 'username';

    let data = entityList.filter(function (item: any) {
      return item[matchProperty].indexOf(opts.query.toLowerCase()) == 0;
    });

    data = data.sort(function (a: any, b: any) {
      return a[matchProperty].localeCompare(b[matchProperty], undefined, {
        sensitivity: 'accent',
      });
    });

    callback(data);
  }
}
