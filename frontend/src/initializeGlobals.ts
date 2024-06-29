import DataUploadStore from "./stores/DataUploadStore";

declare global {
  interface Window {
    _ipsa: {
      dataUploadStore: typeof DataUploadStore;
    };
  }
}
window._ipsa = {
  dataUploadStore: DataUploadStore,
};
