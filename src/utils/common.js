/* @flow */

/**
 * Utility function to execute callback for each key->value pair.
 */
export function forEach(obj: Object, callback: Function) {
  if (obj) {
    for (const key in obj) {
      // eslint-disable-line no-restricted-syntax
      if ({}.hasOwnProperty.call(obj, key)) {
        callback(key, obj[key]);
      }
    }
  }
}

export function hasProperty(obj: Object, property: string) {
  let result = false;
  if (obj) {
    for (const key in obj) {
      // eslint-disable-line no-restricted-syntax
      if ({}.hasOwnProperty.call(obj, key) && property === key) {
        result = true;
        break;
      }
    }
  }
  return result;
}

/**
 * The function returns true if the string passed to it has no content.
 */
export function isEmptyString(str: string): boolean {
  return !str || !str.trim();
}

/**
 * The function will return true for simple javascript object,
 * which is not any other built in type like Array.
 */
export function isMap(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * The function will return filter out props from and return new props.
 */
export function filter(obj, keys) {
  const filteredKeys = Object.keys(obj).filter((key) => keys.indexOf(key) < 0);
  const filteredObject = {};
  if (filteredKeys && filteredKeys.length > 0) {
    filteredKeys.forEach((key) => {
      filteredObject[key] = obj[key];
    });
  }
  return filteredObject;
}

export function stopPropagation(event) {
  event.stopPropagation();
}

/**
 * The function will return array which contain all the elements
 *  which matches with the searchText
 */

export function searchElement(searchList, searchText, isCaseSensitive) {
  const result =
    searchList &&
    searchList.filter((suggestion) => {
      if (!searchText || searchText.length === 0) {
        return true;
      }
      if (isCaseSensitive) {
        return suggestion.value.indexOf(searchText) >= 0;
      }
      return suggestion.value.toLowerCase().indexOf(searchText && searchText.toLowerCase()) >= 0;
    });
  return result;
}

export function debounce(func, delay = 500) {
  let timerId;
  return function () {
    clearTimeout(timerId);
    timerId = setTimeout(() => func.apply(this, arguments), delay);
  };
}

export const getPlatformPrefix = () => {
  let platformPrefix = 'ctrl';
  let platform = navigator.userAgentData?.platform.toLowerCase() || 'linux';
  if (platform.includes('mac')) {
    platformPrefix = 'cmd';
  }
  return platformPrefix;
};

export function isValidUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const trimmedUrl = url.trim();
  
  // Empty string is not valid
  if (trimmedUrl === '') {
    return false;
  }

  // Check for unsafe protocols (case-insensitive)
  const unsafeProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:'];
  const lowerUrl = trimmedUrl.toLowerCase();
  
  for (const protocol of unsafeProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return false;
    }
  }

  // Allow safe protocols
  const safeProtocols = ['https://', 'http://', 'mailto:', 'tel:'];
  for (const protocol of safeProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return true;
    }
  }
  if (trimmedUrl.startsWith('/') || trimmedUrl.startsWith('#') || trimmedUrl.startsWith('./') || trimmedUrl.startsWith('../')) {
    return true;
  }
  const colonIndex = trimmedUrl.indexOf(':');
  const slashIndex = trimmedUrl.indexOf('/');
  
  // If there's a colon before the first slash, it might be a protocol
  if (colonIndex !== -1 && (slashIndex === -1 || colonIndex < slashIndex)) {
    return false;
  }
  
  // Check if it looks like a domain or URL-like string
  // Must contain at least one dot (for domains) or slash (for paths)
  // Must not contain spaces (which would indicate plain text)
  // This allows linkify-it to normalize URLs like "example.com" or "www.example.com"
  const hasDot = trimmedUrl.includes('.');
  const hasSlash = trimmedUrl.includes('/');
  const hasSpace = trimmedUrl.includes(' ');
  
  if (hasSpace) {
    // Plain text with spaces is not a valid URL
    return false;
  }
  
  if (hasDot || hasSlash) {
    // Looks like it could be a domain or path - allow linkify-it to handle it
    // Basic check: starts with alphanumeric and contains valid URL characters
    const urlLikePattern = /^[a-zA-Z0-9][a-zA-Z0-9._\-/:]*$/;
    return urlLikePattern.test(trimmedUrl);
  }
  
  // Reject plain text that doesn't match any URL pattern
  return false;
}

export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') {
    return '#';
  }

  const trimmedUrl = url.trim();
  
  if (trimmedUrl === '') {
    return '#';
  }

  // If URL is valid, return it as-is
  if (isValidUrl(trimmedUrl)) {
    return trimmedUrl;
  }

  // If URL is unsafe, return '#' to prevent execution
  return '#';
}
