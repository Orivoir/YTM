import {
  documentDirectory,
  createDownloadResumable
} from 'expo-file-system'

import deleteMusicFileSystem from '../libs/delete-music-file-system';

import React from 'react';

import {DeviceEventEmitter} from 'react-native'
import { EVENT_DOWNLOAD_PROGRESS_UPDATE } from '../constant';

export type ProgressState = {
  percent: number;
  totalBytesWritten: number;
  totalBytesExpectedToWrite: number;
  isFinish: boolean;
}

export type UseDownloadOptions = {

  onDownloadFinish: (result: {filename: string}) => void;
  onDownloadAbort: () => void;
  onDownloadError: (error: any) => void;
  /**
   * @param sizeBytes - data length in bytes extract from **HTTP** header `Content-Length`
   */
  onGetDownloadSize: (sizeBytes: number) => void;

  onToggleDownloadStatus: (status: "pause" | "resume") => void;
}

export default function useDownload(options: UseDownloadOptions) {
  const filename = React.useRef<string>("");
  const hasEmitDownloadSize = React.useRef<boolean>(false);
  const downloadResumable = React.useRef<null | ReturnType<typeof createDownloadResumable>>(null);
  const downloadId = React.useRef<string | null>(null);

  React.useEffect(() => {

    return () => {
      filename.current = "";
      downloadId.current = null;
      downloadResumable.current?.cancelAsync()
      .then(() => {
        console.log("> download has been silent unload");
      })
    }
  }, []);

  const isValidExpected = (value: number): boolean => (
    value > 0 &&
    !isNaN(value) &&
    isFinite(value)
  )

  const onCancelDownload = (shouldClean: boolean = false) => {
    downloadResumable.current?.cancelAsync()
      .then(options.onDownloadAbort)
      .catch(options.onDownloadError)
      .finally(() => {
        hasEmitDownloadSize.current = false;
      })

    if(shouldClean) {
      deleteMusicFileSystem(filename.current)
      .then(() => {
        console.log("> file partial download has been deleted")
      })
    }

    filename.current = "";
    downloadId.current = null;
  }

  const onUpdateProgress = (params: {
    totalBytesExpectedToWrite: number,
    totalBytesWritten: number
  }) => {
    if(isValidExpected(params.totalBytesExpectedToWrite)) {

      if(!hasEmitDownloadSize.current) {

        hasEmitDownloadSize.current = true;
        options.onGetDownloadSize(params.totalBytesExpectedToWrite);
      }

      const pct = (params.totalBytesWritten / params.totalBytesExpectedToWrite) * 100;

      DeviceEventEmitter.emit(EVENT_DOWNLOAD_PROGRESS_UPDATE, {
        percent: pct,
        totalBytesExpectedToWrite: params.totalBytesExpectedToWrite,
        totalBytesWritten: params.totalBytesWritten,
        isFinish: (params.totalBytesWritten >= params.totalBytesExpectedToWrite),
        id: downloadId.current
      })

    } else {
      console.log("> server not provide valid expected bytes data");

      onCancelDownload(false);
    }
  }

  /**
   * @param remote server URI used for download content
   */
  const startDownload = (remote: string, id: string | null = null) => {

    filename.current = `${Date.now().toString()}-${Math.random().toString()}.mp3`;
    downloadId.current = id;

    downloadResumable.current = createDownloadResumable(
      remote,
      documentDirectory + filename.current,
      {},
      onUpdateProgress
    )

    downloadResumable.current.downloadAsync()
    .then((result) => {
      if(result) {

        options.onDownloadFinish({
          filename: filename.current
        })

      } else {
        options.onDownloadAbort();
      }
    })
    .catch(options.onDownloadError)
    .finally(() => {
      hasEmitDownloadSize.current = false;
    })
  }

  const cancelDownload = () => {
    onCancelDownload(true);
  }

  const pauseDownload = () => {
    downloadResumable.current?.pauseAsync()
    .then(() => {
      options.onToggleDownloadStatus("pause");
    })
    .catch(options.onDownloadError);
  }

  const resumeDownload = () => {
    downloadResumable.current?.resumeAsync()
    .then(() => {
      options.onToggleDownloadStatus("resume")
    })
    .catch(options.onDownloadError);
  }

  return {
    startDownload,
    cancelDownload,
    pauseDownload,
    resumeDownload
  }

}