<?php

/*
  File name format:
    [subject];[module name];[Chapter/section name].jwrsc
*/

class Files {
    private $filesRaw;
    private $files;

    function __construct() {
        $this->filesRaw = scandir(dirname(__FILE__) . '/../saves/alevelresources');
        $this->files = array_diff($this->filesRaw, array('.', '..')); // remove . and .. files
    }

    public function getFiles() {
        $files = [];

        foreach($this->files as $file) {
            $fileName = explode('.jwrsc', $file)[0];

            $components = explode(';', $fileName);

            $files[] = [
                'subject' => $components[0],
                'module' => $components[1],
                'worksheet' => $components[2],
                'filename' => $file
            ];
        }

        return $files;
    }

    public function getSubjects() {
        $subjects = [];

        foreach($this->files as $file) {
            $subject = explode(';', $file)[0];

            $inList = false;
            foreach($subjects as $existingSubject) {
                if ($subject === $existingSubject) {
                    $inList = true;
                }
            }

            if (!$inList) {
                $subjects[] = $subject;
            }
        }

        return $subjects;
    }
}