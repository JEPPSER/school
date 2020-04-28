#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>

#include "mapscene.h"
#include "mapview.h"

struct observation {
    QString station;
    int year;
    int month;
    qreal temp;
    int number;
};

struct station {
    QString id;
    qreal latitude;
    qreal longitude;
    qreal elevation;
    QString countryCode;
    QString name;
    int yearFirst;
    int yearLast;
};

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private:
    MapScene *Scene;
    MapView *View;
};
#endif // MAINWINDOW_H
