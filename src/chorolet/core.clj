(ns chorolet.core
  (:require [cheshire.core :refer :all]
            [clojure.java.io :as io]
            [clojure.data.csv :as csv]))


;; GIS data

(def GIS_FILE "data/nlgis_1982.json")

(defn read-json [f]
  (parse-string (slurp f) true))

(defn write-json
  [root filename]
  (let [path (str "data/" filename)]
    (with-open [out (clojure.java.io/writer path)]
      (generate-stream root out {:pretty false}))))

;; TK Data

(def TK_FILE  "data/TK1982.csv")

(def PROPS   ["AmsterdamseCode"])
(def PARTIES ["CDA" "CPN" "PvdA" "SGP" "VVD"])

(defn read-csv [f]
  (with-open [in-file (io/reader f)]
    (doall
     (csv/read-csv in-file))))

(defn parse-int [s]
  (try
    (Integer/parseInt s)
    (catch Exception e s)))

(defn read-tk []
  (let [csv (read-csv TK_FILE)
        rows (map #(map parse-int %) (rest csv))
        cols (first csv)]
    (for [m (map (partial zipmap cols) rows)
          :let [results (select-keys m PARTIES)
                largest (first (apply max-key val results)) 
                props (select-keys m PROPS)]]
      (assoc props "grootste" largest))))

;; Transform

(defn idx-tk [coll k]
  (reduce
   (fn [m n]
     (let [key (get n k)]
       (assoc m key (dissoc n k)))) {} coll))

(defn transform []
  (let [idx (idx-tk (read-tk) "AmsterdamseCode")
        json (read-json GIS_FILE)]
    (write-json
     (assoc json :features
            (for [f (:features json)
                  :let [props (:properties f)
                        found (get idx (:amsterdamcode props))]]
              (assoc f :properties (merge props found))))
     "nlgis_1982+TK1982.json")))
