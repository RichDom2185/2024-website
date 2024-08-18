import markdownClasses from './markdown_classes.json';
import plantuml from './plantuml.json';

export {
  // TODO: Use a YAML loader instead
  /** Classes to inject to markdown body */
  markdownClasses,
  // Adapted into JSON from
  // https://github.com/qjebbs/vscode-plantuml/blob/master/syntaxes/plantuml.yaml-tmLanguage
  /** Language grammar for PlantUML support */
  plantuml,
};
