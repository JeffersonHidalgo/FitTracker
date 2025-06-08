using Data.Repos;
using FitTrackerApi.Data.Utils;
using Models;
using Models.Reportes;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using ScottPlot;
using System;
using Utils;

public class ReportService : IReportService
{
    private readonly IClienteRepository _clienteRepository;
    private readonly IEmpresaRepository _empresaRepository;

    public ReportService(IClienteRepository clienteRepository, IEmpresaRepository empresaRepository)
    {
        _clienteRepository = clienteRepository;
        _empresaRepository = empresaRepository;
    }

    public async Task<byte[]> GenerarReporteMetricasConGraficos(int codigoCliente)
    {
        var datos = await _clienteRepository.ObtenerMetricasConAnalisisAsync(codigoCliente);
        if (datos == null)
            throw new Exception("No se encontraron métricas para este cliente.");

        var clienteInfo = await _clienteRepository.GetCliente(codigoCliente);
        var empresa = await _empresaRepository.ObtenerConfiguracionAsync();

        using var stream = new MemoryStream();

        // Lista de todos los gráficos
        var graficos = new List<(string Titulo, float Cliente, float Sedentario, float Fitness)>
        {
            ("IMC", Convertidor.ToFloat(datos.Imc), 27, 22),
            ("% Grasa", Convertidor.ToFloat(datos.GrasaCorporal), 28, 14),
            ("Masa Muscular", Convertidor.ToFloat(datos.MasaMuscular), 28, 35),
            ("Press Banca", Convertidor.ToFloat(datos.RmPress), 40, 80),
            ("Sentadilla", Convertidor.ToFloat(datos.RmSentadilla), 60, 120),
            ("Peso Muerto", Convertidor.ToFloat(datos.RmPesoMuerto), 70, 140),
            ("Test Cooper", Convertidor.ToFloat(datos.TestCooper), 1600, 2600),
            ("FC Reposo", Convertidor.ToFloat(datos.FcReposo), 80, 55),
            ("Flexibilidad", Convertidor.ToFloat(datos.Flexibilidad), 15, 25),
            ("Salto Vertical", Convertidor.ToFloat(datos.SaltoVertical), 25, 50),
            ("RPE", Convertidor.ToFloat(datos.Rpe), 7, 5)
        };

        // Configuración para número de gráficos
        int columnas = 3; // 3 columnas

        Document.Create(doc =>
        {
            // Página única con todo el contenido
            doc.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(30);

                // Encabezado
                page.Header().Row(row =>
                {
                    // Logo con espacio a la derecha
                    if (!string.IsNullOrEmpty(empresa.Logo))
                    {
                        row.ConstantItem(60).Height(60).Image(empresa.Logo);
                    }
                    else
                    {
                        row.ConstantItem(60).Height(60);
                    }

                    // Espacio entre logo y texto
                    row.ConstantItem(15).Height(60);

                    // Resto del encabezado
                    row.RelativeItem()
                        .Column(col =>
                        {
                            col.Item().Text(empresa.NombreEmpresa)
                                .FontSize(18).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Medium);
                            col.Item().Text($"{empresa.Direccion}, {empresa.Ciudad}, {empresa.Provincia}")
                                .FontSize(10).FontColor(QuestPDF.Helpers.Colors.Grey.Darken2);
                            col.Item().Text($"Tel: {empresa.TelefonoEmpresa} | Email: {empresa.EmailEmpresa}")
                                .FontSize(10).FontColor(QuestPDF.Helpers.Colors.Grey.Darken2);
                        });
                    row.ConstantItem(140)
                        .Column(col =>
                        {
                            col.Item().Text($"Cliente: {clienteInfo.NombreCompleto}")
                                .FontSize(13).Bold();
                            var edad = DateTime.Today.Year - clienteInfo.FechaNacimiento.Year;
                            col.Item().Text($"Edad: {edad} años")
                                .FontSize(11);
                        });
                });

                page.Content().Column(col =>
                {
                    col.Spacing(12); // Reducido de 18 a 12 para ahorrar espacio

                    // Título principal
                    col.Item().Text("Reporte de Métricas y Análisis")
                        .FontSize(18).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Darken2).Underline();

                    col.Item().LineHorizontal(1).LineColor(QuestPDF.Helpers.Colors.Grey.Lighten2);

                    col.Item().PaddingTop(8).Text("Análisis por Sección") // Reducido de 10 a 8
                        .FontSize(14).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Darken2).Underline();
                    col.Item().PaddingBottom(6).Column(analisisCol => // Reducido de 8 a 6
                    {
                        foreach (var kv in datos.ResumenAnalisis)
                            analisisCol.Item().Text($"{kv.Key}: {kv.Value}")
                                .FontSize(10).FontColor(QuestPDF.Helpers.Colors.Grey.Darken2); // Reducido de 11 a 10
                    });

                    col.Item().LineHorizontal(1).LineColor(QuestPDF.Helpers.Colors.Grey.Lighten2);

                    col.Item().PaddingTop(8).Text("Indicadores Clave Comparativos") // Reducido de 10 a 8
                        .FontSize(14).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Darken2).Underline();

                    // LEYENDA COMÚN MEJORADA - con más espacio entre elementos
                    col.Item().PaddingTop(4).Row(row => 
                    {
                        row.AutoItem().Text("Leyenda: ").FontSize(9).Bold();
                        
                        row.AutoItem().Container().Height(10).Width(10)
                            .Background(QuestPDF.Helpers.Colors.Blue.Medium);
                        row.AutoItem().PaddingRight(8).Text(" Cliente").FontSize(9); // Añadido PaddingRight
                        
                        row.AutoItem().Container().Height(10).Width(10)
                            .Background(QuestPDF.Helpers.Colors.Grey.Medium);
                        row.AutoItem().PaddingRight(8).Text(" Sedentario").FontSize(9); // Añadido PaddingRight
                        
                        row.AutoItem().Container().Height(10).Width(10)
                            .Background(QuestPDF.Helpers.Colors.Green.Medium);
                        row.AutoItem().Text(" Fitness").FontSize(9);
                    });

                    // TODOS LOS GRÁFICOS EN UNA SOLA SECCIÓN
                    col.Item().PaddingTop(6).Grid(grid =>
                    {
                        grid.Columns(columnas);
                        // Iterar por todos los gráficos (sin límite)
                        for (int i = 0; i < graficos.Count; i++)
                        {
                            var g = graficos[i];
                            grid.Item().Column(barCol =>
                            {
                                barCol.Item().AspectRatio(0.8f) // Ajustado de 1.0f a 0.8f para que sean menos altos
                                    .Scale(0.8f) // Añadido Scale para hacerlos un poco más pequeños
                                    .Svg(size => CreateBarSvg(size, g.Titulo, g.Cliente, g.Sedentario, g.Fitness));
                            });
                        }
                    });

                    // Recomendaciones
                    col.Item().PaddingTop(8).LineHorizontal(1).LineColor(QuestPDF.Helpers.Colors.Grey.Lighten2);

                    col.Item().PaddingTop(8).Text("Recomendaciones")
                        .FontSize(14).Bold().FontColor(QuestPDF.Helpers.Colors.Blue.Darken2).Underline();
                    col.Item().PaddingTop(4).Column(recCol =>
                    {
                        foreach (var rec in datos.Recomendaciones)
                            recCol.Item().PaddingBottom(2).Text("• " + rec)
                                .FontSize(10).FontColor(QuestPDF.Helpers.Colors.Black); // Reducido de 11 a 10
                    });
                });

                page.Footer().AlignCenter().Text(txt =>
                {
                    txt.Span("Página ").FontSize(9);
                    txt.CurrentPageNumber().FontSize(9);
                    txt.Span(" de ").FontSize(9);
                    txt.TotalPages().FontSize(9);
                });
            });
            
            // ELIMINADA LA LÓGICA DE SEGUNDA PÁGINA
        })
        .GeneratePdf(stream);

        return stream.ToArray();
    }

    // Helper to build SVG bar chart
    private string CreateBarSvg(Size size, string title, float cliente, float sed, float fit)
    {
        var plt = new ScottPlot.Plot();
        double[] values = { cliente, sed, fit };
        var bars = plt.Add.Bars(values);

        // Colores de barras consistentes
        bars.Bars[0].FillColor = ScottPlot.Colors.Blue;
        bars.Bars[1].FillColor = ScottPlot.Colors.Gray;
        bars.Bars[2].FillColor = ScottPlot.Colors.Green;

        // Etiquetas numéricas simples en lugar de texto 
        plt.Axes.Bottom.TickGenerator = new ScottPlot.TickGenerators.NumericManual(
            new[] {
                new ScottPlot.Tick(0, "1"),
                new ScottPlot.Tick(1, "2"),
                new ScottPlot.Tick(2, "3")
            });

        // Título más prominente
        plt.Title(title, size: 12);
        
        // Establecer límite inferior en 0
        plt.Axes.Left.Min = 0;
        
        return plt.GetSvgXml((int)size.Width, (int)size.Height);
    }
}
