import "./ReloadPrompt.css";
import { useRegisterSW } from "virtual:pwa-register/react";
import { pwaInfo } from "virtual:pwa-info";

console.log(pwaInfo);

function ReloadPrompt() {
  const buildDate = "__DATE__";
  const reloadSW = "__RELOAD_SW__";

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker at: ${swUrl}`);
      if (reloadSW === "true") {
        r &&
          setInterval(() => {
            console.log("Checking for sw update");
            r.update();
          }, 10000); // 10s for testing purposes
      } else {
        console.log("SW Registered: " + r);
      }
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div>
      {(offlineReady || needRefresh) && (
        <div className="toast">
          <div role="alert" className="alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            {offlineReady ? (
              <span className="text-sm">App ready to work offline</span>
            ) : (
              <span className="text-sm">
                New content available, click on reload button to update.
              </span>
            )}
          </div>
          {needRefresh && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => updateServiceWorker(true)}
            >
              Reload
            </button>
          )}
          <button className="btn btn-sm" onClick={() => close()}>
            Close
          </button>
        </div>
      )}
      <div className="ReloadPrompt-date">{buildDate}</div>
    </div>
  );
}

export default ReloadPrompt;
