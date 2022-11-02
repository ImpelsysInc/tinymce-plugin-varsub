import { Editor, TinyMCE } from 'tinymce';

declare const tinymce: TinyMCE;

const setup = (editor: Editor, url: string): void => {
  editor.ui.registry.addButton('varsub', {
    text: 'varsub button',
    onAction: () => {
      editor.setContent('<p>content added from varsub</p>');
    }
  });
};

export default (): void => {
  tinymce.PluginManager.add('varsub', setup);
};
