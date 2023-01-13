import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import moment from 'moment';
import '../../../node_modules/bootstrap/js/dist/offcanvas.js';
import { ReactComponent as NoteIcon } from '../../assets/svg/note.svg';
import { ReactComponent as NotesIcon } from '../../assets/svg/notes.svg';
import { ReactComponent as DeleteIcon } from '../../assets/svg/delete.svg';
import { ReactComponent as CameraIcon } from '../../assets/svg/camera.svg';
import { ReactComponent as ImagePlaceholderIcon } from '../../assets/svg/image_placeholder.svg';
import './styles.scss';
import TouchableButton from 'components/TouchableButton';
import { IDocument, IUploadMeta } from 'interfaces/documents.js';
import { useLoanDispatch, useLoanState } from 'contexts/loanContext';
import documents from 'screens/loanApplication/documents/index.js';
import useToast from '../../hooks/useToast';
import { FILE_SIZE } from 'common/constants/globals';

export interface IUploadDocument {
  onClick?: () => void;
  onClose?: () => void;
  onDelete?: (d: any) => void;
  item: IDocument;
  onDocumentAdded?: (
    file: FormData,
    meta: { url: string; name: string; key: string; slug: string }
  ) => void;
  title?: string;
  loanId?: string;
  label?: string;
  desc?: string;
  id: string;
  slug: string;
  uploading?: boolean;
  uploaded?: boolean;
  progressValue?: number;
}

export interface IUploadDocumentRef {
  toggle(): void;
}
const UploadDocument: React.ForwardRefRenderFunction<
  IUploadDocumentRef,
  IUploadDocument
> = ({ onClick, label, desc, onClose, loanId, item, slug, id }, ref) => {
  const { documentUpload, setUploadedDocuments } = useLoanDispatch();

  const timeouts = useRef<any>([]);

  const { requiredDocuments, createLoan, selectedDocument, uploadedDocuments } =
    useLoanState();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [source, setSource] = useState('');
  const [documents, setDocuments] = useState<{ [key: string]: IUploadMeta }>({});
  const [uploading, setUploading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  // const [progressValue, setProgressValue] = useState(0);
  const Toast = useToast();

  useEffect(() => {
    // let files = Object.values(documents);
    //     setUploadedDocuments({
    //       [item._id]: files,
    //     });
  }, [documents, loaded, uploading]);

  useEffect(() => {
    return () => {
      if (timeouts.current)
        for (var i = 0; i < timeouts.current.length; i++) {
          clearTimeout(timeouts[i]);
        }
    };
  }, []);

  useEffect(() => {
    if (item && uploadedDocuments && uploadedDocuments[item._id]) {
      // setDocuments(uploadedDocuments[id]);s
      const real = uploadedDocuments[item._id];
      const oo = {};

      for (let i = 0; i < uploadedDocuments[item._id].length; i++) {
        const currentNode = real[i];
        oo[currentNode.key] = currentNode;
      }
      setDocuments(oo);
    } else {
      // setDocuments([]);
    }
  }, [uploadedDocuments, id]);

  useImperativeHandle(ref, () => ({
    toggle: () => {
      buttonRef.current?.click();
    },
  }));

  async function handleOnUpload(params: FormData, meta: IUploadMeta) {
    setLoaded(true);
    try {
      if (item.slug && loanId) {
        params.append('name', slug);
        params.append('loanApplicationId', loanId);

        setUploading(true);
        const resp = await documentUpload(params);
        setUploading(false);
        if (resp && resp.statusCode === 200) {
          Toast.success('Upload successful');
          setUploadedDocuments(meta);
          setDocuments((prev) => {
            const ps = prev;
            const dd = ps[meta.key];

            dd.progress = 100;
            setTimeout(() => {
              buttonRef.current?.click();
              if (onClose) onClose();
            }, 500);
            return { ...prev, [meta.key]: dd };
          });
        } else {
          setDocuments((prev) => {
            const ps = prev;
            const dd = ps[meta.key];

            dd.progress = 0;
            setTimeout(() => {
              buttonRef.current?.click();
              if (onClose) onClose();
            }, 500);
            return { ...prev, [meta.key]: dd };
          });
          Toast.error(resp.message || 'Can not upload document at the moment');
        }
      }
    } catch (err) {
      setDocuments((prev) => {
        const ps = prev;
        const dd = ps[meta.key];

        dd.progress = 0;
        setTimeout(() => {
          buttonRef.current?.click();
          if (onClose) onClose();
        }, 500);
        return { ...prev, [meta.key]: dd };
      });
      // Toast.error(err.message);
    }
  }

  document.body.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  function onDelete(d: IUploadMeta) {
    const { [d.key]: ds, ...rest } = documents;
    setDocuments(rest);
  }
  const handleCapture = (target: any) => {
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];
        if (file.size > FILE_SIZE) {
          if (onClose) onClose();
          return Toast.error('File should not be more than 2MB');
        }
        const formData = new FormData();
        formData.append('file', file);

        const newUrl = URL.createObjectURL(file);
        setSource(newUrl);
        // const docs = documents;
        const meta = {
          url: newUrl,
          name: file.name,
          documentId: item._id,
          key: `${item._id}_${documents ? Object.keys(documents).length : 0}`,
          slug: item.slug,
          progress: 0,
        };
        const docs = { ...documents, [meta.key]: meta };
        setDocuments(docs);
        let time = 0;
        const tt = window.setInterval(() => {
          time = time += 0.3;
          setDocuments((prev) => {
            try {
              const ps = prev;
              const dd = ps[meta.key];
              if (!dd) {
                clearTimeout(tt);
              }

              if (dd.progress >= 100) {
                clearTimeout(tt);
              }
              if (time < 10) {
                dd.progress = dd.progress + 1;
                return { ...prev, [meta.key]: dd };
              }
              if (time >= 10) {
                if (time >= 12) {
                  return prev;
                }
                dd.progress = dd.progress + 0.67;
                return { ...prev, [meta.key]: dd };
              }
              // dd.progress = dd.progress + 5;
              return { ...prev, [meta.key]: dd };
            } catch (e) {
              return prev;
            }
          });
        }, 300);

        if (timeouts.current) {
          timeouts.current.push(tt);
        } else {
          timeouts.current = [tt];
        }
        setTimeout(() => {
          handleOnUpload(formData, meta);
        }, 400);
        // if (onDocumentAdded) onDocumentAdded(formData, meta);
        // target.target.value = null;
      }
    }
  };
  return (
    <div className="slide-modal-container ">
      <button
        ref={buttonRef}
        id="bottom-menu"
        className="btn btn-primary bottom-menu"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasBottom"
        aria-controls="offcanvasBottom"
      >
        Toggle bottom offcanvas
      </button>

      <div
        className="offcanvas offcanvas-bottom"
        // @ts-ignore
        tabIndex="-1"
        style={{ height: '80vh' }}
        id="offcanvasBottom"
        aria-labelledby="offcanvasBottomLabel"
      >
        <div className="offcanvas-header d-flex justify-content-center align-items-center">
          <h4 className="offcanvas-title" id="offcanvasBottomLabel">
            Back
          </h4>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setDocuments({});
              setSource('');
              if (onClose) onClose();
            }}
          ></button>
        </div>
        <div className="offcanvas-body small container-sm">
          <div style={{ marginBottom: 27 }}>
            <h4>{label}</h4>
            <span style={{ color: '#7F91A8', fontSize: 10 }}>{desc}</span>
          </div>
          <div
            className="d-flex flex-column align-items-center justify-content-center"
            style={{}}
          >
            <NoteIcon />

            <input
              accept="image/*;capture=camera"
              id="icon-button-file"
              type="file"
              // capture="camera"
              // capture="environment"
              style={{ display: 'none' }}
              onChange={(e) => handleCapture(e.target)}
              onClick={(event) => {
                // @ts-ignore
                event.target.value = null;
              }}
            />

            <div
              className="d-flex justify-content-end flex-grow-1"
              style={{ width: '100%', marginTop: 23, marginBottom: 13 }}
            >
              <CameraIcon /> <span className="ms-2">Take Photo</span>
            </div>
            <label htmlFor="icon-button-file" className="w-100">
              <div
                className="d-flex flex-row justify-content-center"
                style={{
                  width: '100%',
                  borderRadius: 3,
                  border: '1px dashed #7F91A8',
                  paddingTop: 9,
                  paddingBottom: 9,
                }}
              >
                <div className="w-25">
                  <ImagePlaceholderIcon />
                </div>

                <div className="d-flex flex-column justify-content-center align-items-center">
                  <span style={{ color: '#7F91A8', fontSize: 14 }}>Browse file</span>
                  <span style={{ color: '#7F91A8', fontSize: 8 }}>
                    File format: JPG, PNG, GIF, PDF
                  </span>
                </div>
                <div className="w-25"></div>
              </div>
            </label>

            <div className="my-4 w-100">
              {/* {!!documents && Object.keys(documents).length > 0? */}
              {!!documents && Object.keys(documents).length > 0
                ? Object.keys(documents).map((d, i) => {
                    const ll = documents[d];
                    return (
                      <div className="mb-3" style={{ position: 'relative' }}>
                        <div
                          key={`${ll.name}${i}`}
                          className="w-100 d-flex flex-row align-items-center "
                          style={{
                            paddingTop: 12,
                            paddingBottom: 12,
                            backgroundColor: '#F2F6F9',
                            zIndex: 2,
                            borderRadius: '.25rem',
                          }}
                        >
                          <div style={{ flex: 1, paddingLeft: 20 }}>
                            <NotesIcon />
                          </div>
                          <div className="d-flex flex-column" style={{ flex: 6 }}>
                            <span>{ll.name}</span>
                            <span>{moment().format('DD mmm, YYYY')}</span>
                          </div>
                          <div
                            style={{ paddingRight: 22 }}
                            onClick={() => {
                              if (onDelete) onDelete(ll);
                            }}
                          >
                            <DeleteIcon />
                          </div>

                          <div
                            className="progress border-radius-0"
                            style={{
                              position: 'absolute',
                              width: '100%',
                              zIndex: -1,
                              bottom: 0,
                              marginBottom: -4,
                              // backgroundColor: "transparent",
                            }}
                          >
                            <div
                              className="progress-bar border-radius-0"
                              role="progressbar"
                              style={{
                                borderRadius: '.25rem',
                                width: `${ll.progress}%`,
                              }}
                              aria-valuenow={ll.progress}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>

            <div className="w-100 mt-5">{/* <TouchableButton label="Submit" /> */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default forwardRef(UploadDocument);
