import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from "@jupyterlab/application";

import {
  ICommandPalette,
  MainAreaWidget,
  WidgetTracker,
} from "@jupyterlab/apputils";

import { APODWidget } from "./APODWidget";

/**
 * Activate the APOD widget extension.
 */
function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  restorer: ILayoutRestorer
) {
  console.log("JupyterLab extension is activated! New!");

  // Declare a widget variable
  let widget: MainAreaWidget<APODWidget>;

  // Add an application command
  const command: string = "apod:open";
  app.commands.addCommand(command, {
    label: "Random Astronomy Picture",
    execute: () => {
      if (!widget) {
        // Create a new widget if one does not exist
        const content = new APODWidget();
        widget = new MainAreaWidget({ content });
        widget.id = "apod-jupyterlab";
        widget.title.label = "Astronomy Picture";
        widget.title.closable = true;
      }
      if (!tracker.has(widget)) {
        // Track the state of the widget for later restoration
        tracker.add(widget);
      }
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(widget, "main");
      }
      widget.content.update();

      // Activate the widget
      app.shell.activateById(widget.id);
    },
  });

  // Add the command to the palette.
  palette.addItem({ command, category: "Tutorial" });

  // Track and restore the widget state
  let tracker = new WidgetTracker<MainAreaWidget<APODWidget>>({
    namespace: "apod",
  });
  restorer.restore(tracker, {
    command,
    name: () => "apod",
  });
}

/**
 * Initialization data for the jupyterlab_apod extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: "jupyterlab_apod",
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate,
};

export default extension;
