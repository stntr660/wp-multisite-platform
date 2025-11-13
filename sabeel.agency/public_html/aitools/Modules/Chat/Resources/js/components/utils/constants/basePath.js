export const BASE_HOST_PATH = routePath+'/chat';
let host = null;
let MianNavUrl = routePath;

if (isLocal == '0') {
    MianNavUrl = '';
    host = '/chat';
} else {
    MianNavUrl = routePath;
    host = routePath+'/chat';
}
export const BASE_ROUTE_PATH = host;
export const BASE_MAIN_NAV_PATH = MianNavUrl;
export const IMAGE_ROOT_PATH = "Modules/Chat/Resources/js/components/assets/images/";
