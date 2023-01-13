export const buildHeader = (
  secure?: boolean,
  headers?: any,
  isUpload?: boolean
): HeadersInit => {
  const token = localStorage.getItem('token');
  const header = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    // 'Accept': '*/*',
  };
  if (secure) {
    const hh = {
      Authorization: `Bearer ${token}`,
      ...(headers ? headers : {}),
    };
    if (!isUpload) {
      Object.assign(header, hh);
    } else {
      return hh;
    }
  } else {
    if (!isUpload) {
      Object.assign(header, headers);
    } else {
      return headers;
    }
  }

  return header;
};

export const makeUrlKeyValuePairs = (json: { [key: string]: any }): string => {
  if (!json || Object.keys(json).length < 1) {
    return '';
  }
  const keys: string[] = Object.keys(json);
  let query = '?';
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    query += encodeURIComponent(key) + '=' + encodeURIComponent(json[key]) + '&';
  }
  return query.replace(/&$/g, '');
};

type RequestObject = {
  type: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  isSecure?: boolean;
  queryParams?: { [key: string]: any };
  onResponse?: () => void;
  data?: { [key: string]: any } | FormData;
  route: string;
  headers?: { [key: string]: any };
};
export async function requestMaker({
  onResponse,
  data,
  type = 'GET',
  queryParams,
  route,
  isSecure = false,
  headers,
}: RequestObject): Promise<any> {
  console.log('✅ Making a request', data, type, queryParams, route, isSecure);
  let response: Response;
  // Handle get request with params
  let routePlusParams = route;
  if (queryParams) {
    routePlusParams += makeUrlKeyValuePairs(queryParams);
  }

  const hh = buildHeader(isSecure, headers, data instanceof FormData);

  let dataObj: any = data;

  if (data instanceof FormData) {
  } else {
    dataObj = JSON.stringify(data);
  }

  const reqBody = {
    method: type,
    headers: hh,
    body:
      type === 'POST' || type === 'DELETE' || type === 'PUT' || type === 'PATCH'
        ? dataObj
        : null,
  };
  response = await fetch(routePlusParams.trim(), reqBody);

  var response2 = response.clone();

  try {
    // TODO: log responses that are not 200
    if (response) {
      const responseJSON = await response.json();
      const v = { ...responseJSON, statusCode: response.status };
      return v;
    }
    return { exception: 'No response returned!' };
  } catch (error: any) {
    const dd = await response2.text();
    let errorMsg = 'An error occurred, please try again later.';
    console.log(
      '✅ An error occurred, please try again later.',
      error.message,
      error.text,
      dd
    );
    return {
      message: errorMsg,
    };
  }
}
