import { ReactElement } from 'react';
import ReactDOM from 'react-dom';

const ANYWHERE_ROOT_ID = 'anywhere-root';

const getPortalRoot = (id: string): HTMLElement => {
  let portalRoot: HTMLElement | null = document.getElementById(id);
  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', id);
    document.body.appendChild(portalRoot);
  }
  return portalRoot;
};

const anywhereRoot: HTMLElement = getPortalRoot(ANYWHERE_ROOT_ID);

export const createContainer = (): HTMLDivElement => {
  const div = document.createElement('div');
  anywhereRoot.appendChild(div);
  return div;
};

export type UnmountFunction = () => void;

const renderAnywhere = (
  node: ReactElement,
  container?: HTMLElement
): UnmountFunction => {
  const containerDom = container || createContainer();

  const unmount: UnmountFunction = () => {
    ReactDOM.unmountComponentAtNode(containerDom);
    if (!container) {
      anywhereRoot.removeChild(containerDom);
    }
  };

  ReactDOM.render(node, containerDom);

  return unmount;
};

export default renderAnywhere;
