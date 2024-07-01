import DataUploadStore from "./stores/DataUploadStore";
import FragmentationStore from "./stores/FragmentationStore";
import PeptideStore from "./stores/PeptideStore";
import UserStore from "./stores/UserStore";

declare global {
  interface Window {
    _ipsa: {
      dataUploadStore: typeof DataUploadStore;
      userStore: typeof UserStore;
      peptideStore: typeof PeptideStore;
      fragmentationStore: typeof FragmentationStore;
    };
  }
}
window._ipsa = {
  dataUploadStore: DataUploadStore,
  userStore: UserStore,
  peptideStore: PeptideStore,
  fragmentationStore: FragmentationStore,
};
